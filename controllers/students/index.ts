import { Request, Response } from 'express';
import { Student } from '../../models';

class StudentsController {
  async getAllStudents(_, res: Response) {
    const students = await Student.findAll();

    res.send({ result: students });
  }

  async createUser(req: Request, res: Response) {
    const newStudent = await Student.create({
      name: req.body.name,
      role: req.body.role,
      age: req.body.age,
      notes: req.body.notes,
      avatar: req.body.avatar,
    });

    res.send(newStudent);
  }
}

const studentsController = new StudentsController();

export default studentsController;
