import { Router } from 'express';

import studentsController from '../../controllers/students';

const studentsRouter = Router();

studentsRouter.get('/', studentsController.getAllStudents);
studentsRouter.post('/', studentsController.createStudent);
studentsRouter.delete('/:id', studentsController.removeStudent);
studentsRouter.put('/:id', studentsController.updateFullStudent);

export default studentsRouter;
