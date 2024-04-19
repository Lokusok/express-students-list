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

        console.log({ newUser });
      });

      res.send({ message: 'Under construct...' });
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при регистрации...' });
    }
  }
}

const sessionController = new SessionController();

export default sessionController;
