import { Request, Response } from 'express';
import { Student, User } from '../../models';

import { TGetStudentsParams } from './types';
import { Sequelize, Op } from 'sequelize';

class StudentsController {
  /**
   * Получить список всех студентов
   */
  async getAllStudents(req: Request, res: Response) {
    try {
      const { role, offset, limit } = req.query;
      // @todo вытаскивать студентов, относящихся к определённому пользователю
      const { userId } = req.session;

      if (!userId) {
        return res.status(400).send({ error: 'Сначала авторизуйтесь' });
      }

      const findUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      // @ts-ignore
      const test = await Student.findAll({
        where: {
          UserId: userId,
        },
      });

      console.log({ findUser });
      console.log({ test });

      let ormParams: TGetStudentsParams = role
        ? {
            where: {
              UserId: userId,
            },
          }
        : {};

      ormParams = {
        ...ormParams,
        offset,
        limit,
      };

      const students = await Student.findAll({
        where: {
          UserId: userId,
        },
      });
      const result = {
        result: students,
        totalPages: Math.ceil(students.length / Number(limit)),
      };

      console.log('@@@', students[0]?.dataValues);

      res.send(result);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: 'Ошибка при получении студентов' });
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

      // // @todo дизейблить на клиенте
      // await new Promise((resolve) => setTimeout(resolve, 3000));

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
