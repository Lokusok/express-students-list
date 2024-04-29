import path from 'node:path';
import dotenv from 'dotenv';

import express from 'express';
import session from 'express-session';

import router from './routers';
import multer from 'multer';

import { sequelize } from './db';

dotenv.config();

const MODE = process.env.NODE_ENV ?? 'development';

console.log('MODE:', MODE);

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').at(-1);
    const uidWithExt = `${crypto.randomUUID()}.${extension}`;
    cb(null, uidWithExt);
  },
});

const PORT = process.env.PORT || 3000;

const app = express();
const upload = multer({ storage });

app.use(
  session({
    secret: process.env.SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 день
    },
  })
);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(upload.single('avatar'));

app.use('/api', router);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    app.listen(PORT, () => {
      console.log(`Started successfully on port ${PORT}`);
    });
  } catch (err) {
    console.log('Error on start:', err);
  }
}

start();
