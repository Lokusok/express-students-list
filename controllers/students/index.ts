import { Student } from '../../models';

class StudentsController {
  async getAllStudents(req, res) {
    const students = await Student.findAll();

    res.send({ result: students });
  }
}

const studentsController = new StudentsController();

export default studentsController;
