import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';

/**
 * Миддлвара для пропуска только вошедших в систему пользователей
 */
function onlyAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session;

  if (!userId) return res.status(403).send({ error: 'Требуется авторизация' });

  const findUser = User.findOne({
    where: {
      id: userId,
    },
  });

  if (!findUser)
    return res.status(403).send({ error: 'Требуется авторизация' });

  next();
}

export default onlyAuth;
