import { Request, Response } from 'express';
import { Student, User } from '../../models';

import { TGetStudentsParams } from './types';

class StudentsController {
  /**
   * Получить список всех студентов
   */
  async getAllStudents(req: Request, res: Response) {
    try {
      const { role, offset, limit } = req.query;
      const { userId } = req.session;

      let ormParams: TGetStudentsParams = role
        ? {
            where: { role, UserId: userId },
          }
        : {
            where: {
              UserId: userId,
            },
          };

      ormParams = {
        ...ormParams,
        offset,
        limit,
      };

      const excellentCount = await Student.count({
        where: {
          role: 'excellent',
        },
      });
      const goodCount = await Student.count({
        where: {
          role: 'good',
        },
      });
      const normalCount = await Student.count({
        where: {
          role: 'normal',
        },
      });
      const badCount = await Student.count({
        where: {
          role: 'bad',
        },
      });

      const students = await Student.findAndCountAll(ormParams);
      const result = {
        result: students.rows,
        totalPages: Math.ceil(students.count / Number(limit)),
        countRoles: {
          excellent: excellentCount,
          good: goodCount,
          normal: normalCount,
          bad: badCount,
        },
      };

      res.send(result);
    } catch (err) {
      res.status(400).send({ error: 'чполучении студентов' });
    }
  }

  /**
   * Создание студента
   */
  async createStudent(req: Request, res: Response) {
    try {
      const file = req.file;
      const path = file?.path;
      const { userId } = req.session;

      const findUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!findUser) {
        return res.status(401).send({ error: 'Пользователя не существует' });
      }

      // @ts-ignore
      const newStudent = await findUser.createStudent({
        name: req.body.name,
        role: req.body.role,
        age: req.body.age,
        notes: req.body.notes,
        avatar: path ? `/${path}` : null,
      });

      res.send(newStudent);
    } catch (err) {
      res.status(400).send({ error: 'Ошибка при добавлении студента' });
    }
  }

  /**
   * Удаление студента
   */
  async removeStudent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleteCount = await Student.destroy({
        where: {
          id,
        },
      });

      if (deleteCount > 0) {
        res.status(200).send({ message: `Студент с id ${id} удалён.` });
      } else {
        res.status(404).send({ message: `Студент с id ${id} не найден.` });
      }
    } catch (err) {
      res.status(400).send({ error: `Ошибка удаления студента с id ${id}.` });
    }
  }

  /**
   * Удаление нескольких студентов
   */
  async removeStudents(req: Request, res: Response) {
    const { ids } = req.body;

    const deletedCount = await Student.destroy({
      where: {
        id: ids,
      },
    });

    if (deletedCount > 0) {
      return res.status(200).send({ message: 'Успешно удалено!' });
    }

    res.status(400).send({ error: 'Ошибка при удалении студентов' });
  }

  /**
   * Изменение студента
   */
  async updateFullStudent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const student = req.body;

      console.log({ incoming: student });

      await Student.update(student, {
        where: {
          id,
        },
      });

      res.status(200).send({ message: `Студент с id ${id} обновлён.` });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: `Ошибка изменения студента с id ${id}.` });
    }
  }

  /**
   * Частичное обновление студента
   */
  async updatePartStudent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const student = req.body;

      await Student.update(student, {
        where: {
          id,
        },
      });

      res.status(200).send({ message: `Студент с id ${id} обновлён.` });
    } catch (err) {
      res.status(400).send({ error: `Ошибка обновления студента с id ${id}.` });
    }
  }
}

const studentsController = new StudentsController();

export default studentsController;
