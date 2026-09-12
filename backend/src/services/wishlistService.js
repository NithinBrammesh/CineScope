import { pool } from '../db/connection.js'
import { getMovieByIdService } from './movieService.js'

const DEFAULT_USER_ID = 1

function parseMovieId(value) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error('Valid movie id is required.')
    error.status = 400
    throw error
  }
  return parsed
}

export async function ensureDefaultUser() {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['default@cinescope.local'])

  if (existing.rows.length > 0) {
    return existing.rows[0].id
  }

  const created = await pool.query(
    'INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id',
    ['default@cinescope.local'],
  )

  if (created.rows[0]?.id) {
    return created.rows[0].id
  }

  const fallback = await pool.query('SELECT id FROM users WHERE email = $1', ['default@cinescope.local'])
  return fallback.rows[0].id
}

export async function getWishlistMovies() {
  const userId = await ensureDefaultUser()
  const { rows } = await pool.query(
    `SELECT movie_id as "movieId", movie_title as "movieTitle", poster_url as "posterUrl", added_at as "addedAt"
     FROM wishlist
     WHERE user_id = $1
     ORDER BY added_at DESC`,
    [userId],
  )

  const enrichedMovies = await Promise.all(
    rows.map(async (movie) => {
      const fallback = {
        movieId: Number(movie.movieId),
        movieTitle: String(movie.movieTitle || '').trim() || 'Untitled movie',
        posterUrl: movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster',
        backdropUrl: '',
        releaseDate: '',
        rating: 0,
        voteCount: 0,
        addedAt: movie.addedAt,
      }

      try {
        const details = await getMovieByIdService(movie.movieId)

        return {
          ...fallback,
          movieTitle: details?.title || fallback.movieTitle,
          posterUrl: details?.posterUrl || fallback.posterUrl,
          backdropUrl: details?.backdropUrl || '',
          releaseDate: details?.releaseDate || '',
          rating: typeof details?.rating === 'number' ? details.rating : 0,
          voteCount: typeof details?.voteCount === 'number' ? details.voteCount : 0,
        }
      } catch {
        return fallback
      }
    }),
  )

  return enrichedMovies
}

export async function addMovieToWishlist({ movieId, movieTitle, posterUrl } = {}) {
  const normalizedId = parseMovieId(movieId)
  const normalizedTitle = String(movieTitle || '').trim()

  if (!normalizedTitle) {
    const error = new Error('Movie title is required.')
    error.status = 400
    throw error
  }

  const userId = await ensureDefaultUser()

  const { rows } = await pool.query(
    `INSERT INTO wishlist (user_id, movie_id, movie_title, poster_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, movie_id) DO NOTHING
     RETURNING movie_id as "movieId", movie_title as "movieTitle", poster_url as "posterUrl"`,
    [userId, normalizedId, normalizedTitle, posterUrl || null],
  )

  if (rows.length === 0) {
    return {
      movieId: normalizedId,
      movieTitle: normalizedTitle,
      posterUrl: posterUrl || null,
      alreadyExists: true,
    }
  }

  return {
    ...rows[0],
    alreadyExists: false,
  }
}

export async function removeMovieFromWishlist(movieId) {
  const normalizedId = parseMovieId(movieId)
  const userId = await ensureDefaultUser()

  const { rowCount } = await pool.query(
    'DELETE FROM wishlist WHERE user_id = $1 AND movie_id = $2',
    [userId, normalizedId],
  )

  return {
    movieId: normalizedId,
    removed: rowCount > 0,
  }
}
