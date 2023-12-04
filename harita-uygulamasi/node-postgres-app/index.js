const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const pool = new Pool({
  user: 'your_postgres_user',
  host: 'your_postgres_host',
  database: 'your_postgres_database',
  password: 'your_postgres_password',
  port: 5432, // PostgreSQL port
});

app.get('/veriler', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});