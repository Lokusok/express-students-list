import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db.js';

import { StudentInstance } from './types.js';

const Student = sequelize.define<StudentInstance>('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isFavourite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Student;
