import { Router } from 'express';

import { sessionController } from '../../controllers';

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.register);
sessionRouter.post('/authenticate', sessionController.authenticate);
sessionRouter.post('/authorize', sessionController.authorize);

export default sessionRouter;
