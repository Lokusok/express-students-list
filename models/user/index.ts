import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const User = sequelize.define('User', {
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
});

export default User;
