import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/cinescope',
  tmdbApiKey: process.env.TMDB_API_KEY || '',
  tmdbAccessToken: process.env.TMDB_ACCESS_TOKEN || '',
  tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  tmdbTimeoutMs: Number(process.env.TMDB_TIMEOUT_MS || 15000),
}
