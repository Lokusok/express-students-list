import { Request, Response } from 'express';

class SessionController {
  /**
   * Зарегистрировать пользователя
   */
  register(req: Request, res: Response) {
    res.send({ message: 'Under construct...' });
  }
}

const sessionController = new SessionController();

export default sessionController;
