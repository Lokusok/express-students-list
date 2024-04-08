import Pg from 'pg';

export const pool = new Pg.Pool({
  host: 'db',
  port: 5432,
  user: 'user123',
  password: 'password123',
  database: 'db123',
});

