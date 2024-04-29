import { Request, Response, NextFunction } from 'express';

function onlyLogined(req: Request, res: Response, next: NextFunction) {
  req.sessionStore.get(req.session.userId, (err, sessionData) => {
    if (err || !sessionData) {
      return res.status(403).send({ error: 'Сначала войдите в систему' });
    }

    next();
  });
}

export default onlyLogined;
