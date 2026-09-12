import { testDatabaseConnection } from '../db/connection.js'

export async function getHealthStatus() {
  const databaseStatus = await testDatabaseConnection()

  return {
    status: 'ok',
    service: 'CineScope API',
    timestamp: new Date().toISOString(),
    database: databaseStatus.connected ? 'connected' : 'unavailable',
    databaseMessage: databaseStatus.message,
  }
}
