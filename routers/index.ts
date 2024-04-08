import { Router } from 'express';

import studentsRouter from './students';

const router = Router();

router.use('/students', studentsRouter);

export default router;
