import { Router } from 'express';

import { sessionController } from '../../controllers';

import onlyAllowed from '../../middlewares/only-allowed';
import onlyAuth from '../../middlewares/only-auth';

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.register);
sessionRouter.post('/remind', onlyAllowed, sessionController.remind);
sessionRouter.post('/login', onlyAllowed, sessionController.login);
sessionRouter.post('/logout', onlyAllowed, sessionController.logout);
sessionRouter.post('/change', onlyAllowed, sessionController.change);
sessionRouter.post('/allow', sessionController.allow);
sessionRouter.post('/confirm', onlyAuth, sessionController.confirmPassword);

sessionRouter.delete('/delete', onlyAuth, sessionController.deleteUser);

export default sessionRouter;
