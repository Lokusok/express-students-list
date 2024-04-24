import { Router } from 'express';

import { sessionController } from '../../controllers';

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.register);
sessionRouter.post('/remind', sessionController.remind);
sessionRouter.post('/login', sessionController.login);
sessionRouter.post('/logout', sessionController.logout);
sessionRouter.post('/change', sessionController.change);

export default sessionRouter;
