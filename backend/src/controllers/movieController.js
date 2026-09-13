import { getMovieByIdService, getMovies, searchMovieList } from '../services/movieService.js'

export async function getMoviesController(req, res, next) {
  try {
    const { page, genre, year, sort } = req.query

    const result = await getMovies({
      page,
      genre,
      year,
      sort,
    })

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function searchMoviesController(req, res, next) {
  try {
    const { q, page, genre, year, sort } = req.query
    const result = await searchMovieList({ q, page, genre, year, sort })

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function getMovieDetailsController(req, res, next) {
  try {
    const { id } = req.params
    const movie = await getMovieByIdService(id)

    res.status(200).json({
      success: true,
      data: movie,
    })
  } catch (error) {
    next(error)
  }
}
