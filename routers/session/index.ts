import { Router } from 'express';

import { sessionController } from '../../controllers';

import onlyAllowed from '../../middlewares/only-allowed';
import onlyAuth from '../../middlewares/only-auth';
import onlyLogined from '../../middlewares/only-logined';
import onlyInProcessRestoringPassword from '../../middlewares/only-in-process-restoring-password';

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.register);
sessionRouter.post(
  '/remind',
  onlyLogined,
  onlyAllowed,
  sessionController.remind
);
sessionRouter.post('/login', onlyAllowed, sessionController.login);
sessionRouter.post('/logout', onlyAllowed, sessionController.logout);
sessionRouter.post('/change', onlyAllowed, sessionController.change);
sessionRouter.post('/allow', sessionController.allow);
sessionRouter.post('/confirm', onlyAuth, sessionController.confirmPassword);
sessionRouter.post(
  '/start_password_restore',
  onlyAllowed,
  sessionController.startPasswordRestore
);
sessionRouter.post(
  '/password_reset',
  onlyAllowed,
  onlyInProcessRestoringPassword,
  sessionController.passwordReset
);

sessionRouter.delete('/delete', onlyAuth, sessionController.deleteUser);

export default sessionRouter;
