import { Router } from 'express';

import { studentsController } from '../../controllers';

import onlyAuth from '../../middlewares/only-auth';
import onlyAllowed from '../../middlewares/only-allowed';

const studentsRouter = Router();

studentsRouter.get(
  '/',
  onlyAllowed,
  onlyAuth,
  studentsController.getAllStudents
);
studentsRouter.post(
  '/',
  onlyAllowed,
  onlyAuth,
  studentsController.createStudent
);
studentsRouter.delete(
  '/:id',
  onlyAllowed,
  onlyAuth,
  studentsController.removeStudent
);
studentsRouter.delete(
  '/',
  onlyAllowed,
  onlyAuth,
  studentsController.removeStudents
);
studentsRouter.put(
  '/:id',
  onlyAllowed,
  onlyAuth,
  studentsController.updateFullStudent
);
studentsRouter.patch(
  '/:id',
  onlyAllowed,
  onlyAuth,
  studentsController.updatePartStudent
);

export default studentsRouter;
