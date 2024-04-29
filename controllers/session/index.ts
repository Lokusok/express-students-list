import { Request, Response } from 'express';

import { User } from '../../models';
import bcrypt from 'bcrypt';
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

      const findUser = await User.findOne({
        where: {
          login,
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
          login,
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

      const findUser = await User.findOne({
        where: {
          login,
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
      res.status(200).send(null);
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

      console.log({ id });
      console.log({ findUser });

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
    const { id } = req.body;

    try {
      const deleteCount = await User.destroy({
        where: {
          id,
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
        if (err) {
          return res.status(401).send({ error: 'Пароли не совпадают' });
        }

        return res.status(200).send({ message: 'Пароли совпадают' });
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при подтверждении пароля' });
    }
  }
}

const sessionController = new SessionController();

export default sessionController;
