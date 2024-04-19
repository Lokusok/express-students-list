import { Request, Response } from 'express';
import { Student } from '../../models';

import { TGetStudentsParams } from './types';

class StudentsController {
  /**
   * Получить список всех студентов
   */
  async getAllStudents(req: Request, res: Response) {
    const { role, offset, limit } = req.query;

    let ormParams: TGetStudentsParams = role
      ? {
          where: { role },
        }
      : {};

    ormParams = {
      ...ormParams,
      offset,
      limit,
    };

    const students = await Student.findAndCountAll(ormParams);
    const result = {
      result: students.rows,
      totalPages: Math.ceil(students.count / Number(limit)),
    };

    res.send(result);
  }

  /**
   * Создание студента
   */
  async createStudent(req: Request, res: Response) {
    const file = req.file;
    const { path } = file;

    try {
      const newStudent = await Student.create({
        name: req.body.name,
        role: req.body.role,
        age: req.body.age,
        notes: req.body.notes,
        avatar: `/${path}`,
      });

      // @todo дизейблить на клиенте
      await new Promise((resolve) => setTimeout(resolve, 3000));

      res.send(newStudent);
    } catch (err) {
      res.status(400).send({ message: 'Ошибка при добавлении пользователя' });
    }
  }

  /**
   * Удаление студента
   */
  async removeStudent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const countOfDelete = await Student.destroy({
        where: {
          id: Number(id),
        },
      });

      if (countOfDelete > 0) {
        res.status(200).send({ message: `Студент с id ${id} удалён.` });
      } else {
        res.status(404).send({ message: `Студент с id ${id} не найден.` });
      }
    } catch (err) {
      res
        .status(400)
        .send({ message: `Ошибка изменения студента с id ${id}.` });
    }
  }

  /**
   * Изменение студента
   */
  async updateFullStudent(req: Request, res: Response) {
    const { id } = req.params;
    const student = req.body;

    try {
      await Student.update(student, {
        where: {
          id: Number(id),
        },
      });

      res.status(200).send({ message: `Студент с id ${id} обновлён.` });
    } catch (err) {
      res
        .status(400)
        .send({ message: `Ошибка изменения студента с id ${id}.` });
    }
  }
}

const studentsController = new StudentsController();

export default studentsController;
