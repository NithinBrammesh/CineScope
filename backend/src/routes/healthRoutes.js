import { Router } from 'express'
import { getHealthStatus } from '../services/healthService.js'

const router = Router()

router.get('/health', async (_req, res, next) => {
  try {
    const health = await getHealthStatus()
    res.status(200).json({
      success: true,
      data: health,
    })
  } catch (error) {
    next(error)
  }
})

export default router
