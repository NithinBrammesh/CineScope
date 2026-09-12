import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import healthRoutes from './routes/healthRoutes.js'
import movieRoutes from './routes/movieRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api', movieRoutes)
app.use('/api', wishlistRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  })
})

app.use((error, _req, res, _next) => {
  console.error(error)

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  })
})

export default app

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`CineScope backend listening on port ${env.port}`)
  })
}
