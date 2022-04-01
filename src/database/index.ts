import * as pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  user: 'User',
  password: 'Password',
  host: 'localhost',
  database: 'sushi-place',
  port: 5432
});

export default pool;