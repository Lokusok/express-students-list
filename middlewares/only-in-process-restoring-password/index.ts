import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';

/**
 * Миддлавара только для пропуска тех пользователей, кто находится
 * в состоянии сброса пароля
 */
async function onlyInProcessRestoringPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const findUser = await User.findOne({
    where: {
      id: req.session.userId,
    },
  });

  if (!findUser.isRestoringPassword) {
    return res
      .status(400)
      .send({ error: 'Нужно находиться в процессе сброса пароля!' });
  }

  next();
}

export default onlyInProcessRestoringPassword;
