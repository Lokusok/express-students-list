import { DataTypes } from 'sequelize';

import { sequelize } from '../../db.js';

import { UserInstance } from './types.js';

const User = sequelize.define<UserInstance>('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true,
  },
  login: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    unique: false,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAllowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default User;
