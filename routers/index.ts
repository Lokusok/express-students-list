import { Router } from 'express';

import studentsRouter from './students';
import sessionRouter from './session';

const router = Router();

router.use('/students', studentsRouter);
router.use('/session', sessionRouter);

export default router;
