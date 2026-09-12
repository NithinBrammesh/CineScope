import { Router } from 'express'
import {
  getMovieDetailsController,
  getMoviesController,
  searchMoviesController,
} from '../controllers/movieController.js'

const router = Router()

router.get('/movies', getMoviesController)
router.get('/movies/search', searchMoviesController)
router.get('/movies/:id', getMovieDetailsController)

export default router
