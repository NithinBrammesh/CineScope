import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: env.databaseUrl,
})

export async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT 1 AS ok')
    return {
      connected: true,
      message: 'Database connection successful',
      result: result.rows[0],
    }
  } catch (error) {
    return {
      connected: false,
      message: 'Database connection unavailable',
      details: error.message,
    }
  }
}

export async function closeDatabasePool() {
  await pool.end()
}
