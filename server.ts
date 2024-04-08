import dotenv from 'dotenv';

import express from 'express';
import router from './routers';

import { sequelize } from './db';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/api', router);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Started successfully on port ${PORT}`);
    });
  } catch (err) {
    console.log('error on start');
    console.log(err);
  }
}

start();
