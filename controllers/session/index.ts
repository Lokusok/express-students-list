import { Request, Response } from 'express';

import { User } from '../../models';
import bcrypt from 'bcrypt';

class SessionController {
  /**
   * Зарегистрировать пользователя
   */
  async register(req: Request, res: Response) {
    try {
      console.log('Register data:', req.body);

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
          console.log('Error when generating passwordHashed');
          return;
        }

        const newUser = await User.create({
          login,
          password: passwordHashed,
        });

        console.log({ newUser: newUser });

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

    console.log('Authenticate reqSession: ', req.session);
    if (sessionUserId) {
      const findUser = await User.findOne({
        where: {
          id: sessionUserId,
        },
      });
      const profileInfo = { ...findUser.dataValues };
      delete profileInfo.password;
      console.log({ profileInfo });

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

      console.log({ login, password });

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
        console.log('FindUserPassword:', findUser.getDataValue('password'));
        const isDataCorrect = bcrypt.compareSync(
          password,
          findUser.getDataValue('password')
        );
        console.log('Login User: ', findUser);
        console.log({ isDataCorrect });

        if (isDataCorrect) {
          // @ts-ignore
          req.session.userId = findUser.getDataValue('id');
          return res.status(200).send(findUser);
        }
      }

      res.status(401).send({ error: 'Неверные данные!' });
    } catch (err) {
      console.log('ERROR:', err);
      res.status(400).send({ error: 'Ошибка при входе в аккаунт...' });
    }
  }

  /**
   * Удаление сессии пользователя
   */
  async logout(req: Request, res: Response) {
    try {
      console.log('Logout session:', req.session);
      req.session.destroy((err) => {
        console.log('Logout err:', err);
      });
      res.status(200).send(null);
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при выходе из аккаунта...' });
    }
  }
}

const sessionController = new SessionController();

export default sessionController;
