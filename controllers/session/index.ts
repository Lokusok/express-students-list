import { Request, Response } from 'express';

import { User } from '../../models';
import bcrypt from 'bcrypt';

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

        // @ts-ignore
        req.session.userId = newUser.getDataValue('id');
        res.status(201).send(profileInfo);
      });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при регистрации...' });
    }
  }

  /**
   * Аутентификация пользователя
   */
  async remind(req: Request, res: Response) {
    // @ts-ignore
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

      await new Promise((res) => setTimeout(res, 3000));

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
          // @ts-ignore
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
}

const sessionController = new SessionController();

export default sessionController;
