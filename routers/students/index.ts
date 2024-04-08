import { Router } from 'express';

import studentsController from '../../controllers/students';

const studentsRouter = Router();

studentsRouter.get('/', studentsController.getAllStudents);

export default studentsRouter;
