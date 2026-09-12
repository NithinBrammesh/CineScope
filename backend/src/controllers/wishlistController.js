import {
  addMovieToWishlist,
  getWishlistMovies,
  removeMovieFromWishlist,
} from '../services/wishlistService.js'

export async function getWishlistController(req, res, next) {
  try {
    const data = await getWishlistMovies()

    res.status(200).json({
      success: true,
      data: { movies: data },
    })
  } catch (error) {
    next(error)
  }
}

export async function addWishlistController(req, res, next) {
  try {
    const { movieId, movieTitle, posterUrl } = req.body || {}
    const result = await addMovieToWishlist({ movieId, movieTitle, posterUrl })

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function removeWishlistController(req, res, next) {
  try {
    const { movieId } = req.params
    const result = await removeMovieFromWishlist(movieId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
