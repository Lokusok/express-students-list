import { Request, Response } from 'express';

import bcrypt from 'bcrypt';

import { User } from '../../models';
import Mailer from '../../services/mailer';

class SessionController {
  /**
   * Зарегистрировать пользователя
   */
  async register(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res
          .status(401)
          .send({ error: 'Неверные данные для регистрации' });
      }

      const lowerLogin = String(login).toLowerCase();

      const findUser = await User.findOne({
        where: {
          login: lowerLogin,
        },
      });

      if (findUser) {
        return res.status(401).send({ error: 'Такой пользователь уже есть!' });
      }

      bcrypt.hash(password, 10, async (err, passwordHashed) => {
        if (err) {
          throw err;
        }

        const newUser = await User.create({
          login: lowerLogin,
          password: passwordHashed,
        });

        const profileInfo = { ...newUser.dataValues };
        delete profileInfo.password;

        req.session.userId = newUser.getDataValue('id');

        Mailer.sendAllowMessage(profileInfo);

        res.status(201).send(null);
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при регистрации...' });
    }
  }

  /**
   * Аутентификация пользователя
   */
  async remind(req: Request, res: Response) {
    const sessionUserId = req.session.userId;

    if (sessionUserId) {
      const findUser = await User.findOne({
        where: {
          id: sessionUserId,
        },
      });
      const profileInfo = { ...findUser.dataValues };
      delete profileInfo.password;

      return res.status(200).send(profileInfo);
    }

    res.status(200).send(null);
  }

  /**
   * Логинизация пользователя
   */
  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res
          .status(401)
          .send({ error: 'Неверные данные для логинизации' });
      }

      const lowerLogin = String(login).toLowerCase();

      const findUser = await User.findOne({
        where: {
          login: lowerLogin,
        },
      });

      if (findUser) {
        const isDataCorrect = bcrypt.compareSync(
          password,
          findUser.getDataValue('password')
        );

        if (isDataCorrect) {
          req.session.userId = findUser.getDataValue('id');
          return res.status(200).send(findUser);
        }
      }

      res.status(401).send({ error: 'Неверные данные!' });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при входе в аккаунт...' });
    }
  }

  /**
   * Удаление сессии пользователя
   */
  async logout(req: Request, res: Response) {
    try {
      req.session.destroy((err) => {
        if (err) {
          throw err;
        }
      });
      res.status(204).send(null);
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при выходе из аккаунта...' });
    }
  }

  /**
   * Изменить данные о пользователе
   */
  async change(req: Request, res: Response) {
    try {
      const { username, bio } = req.body;
      const file = req.file;
      const path = file?.path;

      const findUser = await User.findOne({
        where: {
          id: req.session.userId,
        },
      });

      findUser.username = username;
      findUser.bio = bio;
      findUser.avatar = path ? `/${path}` : null;

      findUser.save();

      res.status(200).send(findUser);
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при изменении данных' });
    }
  }

  /**
   * Разрешить пользователю вход в систему
   */
  async allow(req: Request, res: Response) {
    const { id } = req.body;

    try {
      const findUser = await User.findOne({
        where: {
          id,
        },
      });

      if (!findUser) {
        return res
          .status(404)
          .send({ error: 'Такого пользователя не существует' });
      }

      if (findUser.isAllowed) {
        return res.status(400).send({ error: 'Пользователь уже подтверждён!' });
      }

      findUser.isAllowed = true;
      findUser.save();

      res.status(204).send(null);
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при подтверждении пользователя' });
    }
  }

  /**
   * Удалить пользователя
   */
  async deleteUser(req: Request, res: Response) {
    const { id, password } = req.body;

    try {
      const findUser = await User.findOne({
        where: {
          id,
        },
      });

      if (!findUser) {
        return res
          .status(404)
          .send({ error: 'Такого пользователя не существует!' });
      }

      bcrypt.compare(password, findUser.password, async (err, result) => {
        if (err || !result) {
          return res.status(401).send({ message: 'Неверный пароль!' });
        }

        const deleteCount = await User.destroy({
          where: {
            id: findUser.id,
          },
        });

        if (deleteCount > 0) {
          delete req.session.userId;
          return res
            .status(200)
            .send({ message: `Пользователь с id ${id} удалён.` });
        } else {
          return res
            .status(404)
            .send({ message: `Пользователь с id ${id} не найден.` });
        }
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при удалении пользователя' });
    }
  }

  /**
   * Подтвердить пароль
   */
  async confirmPassword(req: Request, res: Response) {
    const { id, password } = req.body;

    try {
      const findUser = await User.findOne({
        where: {
          id,
        },
      });

      bcrypt.compare(password, findUser.password, (err, result) => {
        if (err || !result) {
          return res.status(401).send({ error: 'Пароли не совпадают' });
        }

        return res.status(200).send({ message: 'Пароли совпадают' });
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при подтверждении пароля' });
    }
  }

  /**
   * Начать процесс восстановления пароля
   */
  async startPasswordRestore(req: Request, res: Response) {
    try {
      const findUser = await User.findOne({
        where: {
          id: req.session.userId,
        },
      });

      findUser.isRestoringPassword = true;
      await findUser.save();

      Mailer.sendResetPasswordMessage(findUser);

      res.status(200).send({
        message: 'Процесс сброса пароля начат. Проверьте Вашу почту.',
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при сбросе пароля' });
    }
  }

  /**
   * Сброс пароля
   */
  async passwordReset(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      const findUser = await User.findOne({
        where: {
          id: req.session.userId,
        },
      });

      findUser.isRestoringPassword = false;

      const isPasswordsEqual = bcrypt.compareSync(
        password,
        findUser.getDataValue('password')
      );

      if (isPasswordsEqual) {
        return res.status(403).send({ error: 'Пароли не должны совпадать!' });
      }

      bcrypt.hash(password, 10, async (err, passwordHashed) => {
        if (err) {
          throw err;
        }

        findUser.password = passwordHashed;
        await findUser.save();

        res.status(204).send(null);
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при сбросе пароля' });
    }
  }
}

const sessionController = new SessionController();

export default sessionController;
