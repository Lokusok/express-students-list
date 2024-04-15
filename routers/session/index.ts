import { Router } from 'express';

import { sessionController } from '../../controllers';

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.register);

export default sessionRouter;
