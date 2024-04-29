import { Request, Response, NextFunction } from 'express';

function onlyLogined(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(403).send({ error: 'Сначала войдите в систему' });
  }

  next();
}

export default onlyLogined;
