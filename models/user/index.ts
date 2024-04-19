import { DataTypes } from 'sequelize';
import { sequelize } from '../../db.js';

const User = sequelize.define('User', {
  login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
