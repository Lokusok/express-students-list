import { Router } from 'express';

import { studentsController } from '../../controllers';
import onlyAuth from '../../middlewares/only-auth';

const studentsRouter = Router();

studentsRouter.get('/', onlyAuth, studentsController.getAllStudents);
studentsRouter.post('/', onlyAuth, studentsController.createStudent);
studentsRouter.delete('/:id', onlyAuth, studentsController.removeStudent);
studentsRouter.delete('/', onlyAuth, studentsController.removeStudents);
studentsRouter.put('/:id', onlyAuth, studentsController.updateFullStudent);

export default studentsRouter;
