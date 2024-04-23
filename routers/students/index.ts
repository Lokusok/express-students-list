import { Router } from 'express';

import { studentsController } from '../../controllers';

const studentsRouter = Router();

studentsRouter.get('/', studentsController.getAllStudents);
studentsRouter.post('/', studentsController.createStudent);
studentsRouter.delete('/:id', studentsController.removeStudent);
studentsRouter.delete('/', studentsController.removeStudents);
studentsRouter.put('/:id', studentsController.updateFullStudent);

export default studentsRouter;
