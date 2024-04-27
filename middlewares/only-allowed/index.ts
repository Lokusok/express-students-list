import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';

async function onlyAllowed(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session;
  const { login } = req.body;

  if (!userId && !login)
    return res.status(403).send({ error: 'Требуется авторизация' });

  let findUser = null;

  if (userId) {
    findUser = await User.findOne({
      where: {
        id: userId,
      },
    });
  } else if (login) {
    findUser = await User.findOne({
      where: {
        login,
      },
    });
  }

  if (!findUser)
    return res.status(404).send({ error: 'Такого пользователя не существует' });

  if (!findUser.isAllowed)
    return res.status(403).send({ error: 'Сначала подтвердите аккаунт' });

  next();
}

export default onlyAllowed;
