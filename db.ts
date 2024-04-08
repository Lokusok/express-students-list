import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('db123', 'user123', 'password123', {
  host: 'db',
  dialect: 'postgres',
});
