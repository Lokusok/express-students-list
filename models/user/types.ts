import { Model, Optional } from 'sequelize';

type TUser = {
  id: string;
  username: string;
  login: string;
  password: string;
  bio: string;
  avatar: string;
};

interface UserCreationAttributes extends Optional<TUser, 'id'> {}

export interface UserInstance
  extends Model<TUser, UserCreationAttributes>,
    TUser {
  createdAt?: Date;
  updatedAt?: Date;
}
