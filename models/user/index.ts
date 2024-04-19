import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const User = sequelize.define('User', {
  login: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
