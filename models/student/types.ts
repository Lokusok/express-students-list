import { Model, Optional } from 'sequelize';

type TStudent = {
  id: string;
  name: string;
  role: string;
  age: string;
  notes: string;
  avatar: string;
  isFavourite: boolean;
  UserId: string;
};

interface StudentCreationAttributes extends Optional<TStudent, 'id'> {}

export interface StudentInstance
  extends Model<TStudent, StudentCreationAttributes>,
    TStudent {
  createdAt?: Date;
  updatedAt?: Date;
}
