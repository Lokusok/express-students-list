import { Router } from 'express';

import { sessionController } from '../../controllers';
import onlyAllowed from '../../middlewares/only-allowed';

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.register);
sessionRouter.post('/remind', onlyAllowed, sessionController.remind);
sessionRouter.post('/login', onlyAllowed, sessionController.login);
sessionRouter.post('/logout', onlyAllowed, sessionController.logout);
sessionRouter.post('/change', onlyAllowed, sessionController.change);
sessionRouter.post('/allow/:id', sessionController.allow);

export default sessionRouter;
