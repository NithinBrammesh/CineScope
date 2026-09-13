import { discoverMovies, getMovieById, searchMovies } from '../clients/tmdbClient.js'

const FALLBACK_POSTER = 'https://via.placeholder.com/300x450?text=No+Poster'

function normalizeMovie(movie) {
  if (!movie || typeof movie !== 'object') {
    return null
  }

  const posterPath = movie.poster_path || movie.posterUrl || ''
  const backdropPath = movie.backdrop_path || movie.backdropUrl || ''

  return {
    id: movie.id,
    title: movie.title || 'Untitled',
    overview: movie.overview || 'No overview available.',
    posterUrl: posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : FALLBACK_POSTER,
    backdropUrl: backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : '',
    releaseDate: movie.release_date || movie.releaseDate || '',
    rating: movie.vote_average ?? 0,
    voteCount: movie.vote_count ?? 0,
  }
}

function normalizePageResponse(payload, { query, page } = {}) {
  const results = Array.isArray(payload?.results) ? payload.results.map(normalizeMovie).filter(Boolean) : []
  const totalPages = Number(payload?.total_pages) || 1
  const totalResults = Number(payload?.total_results) || results.length

  return {
    movies: results,
    pagination: {
      page: Number(page) || Number(query?.page) || 1,
      totalPages,
      totalResults,
    },
  }
}

export async function getMovies({ page = 1, genre, year, sort } = {}) {
  const safePage = Number(page) || 1

  if (safePage < 1) {
    const error = new Error('Page must be greater than or equal to 1.')
    error.status = 400
    throw error
  }

  const payload = await discoverMovies({ page: safePage, genre, year, sort })
  return normalizePageResponse(payload, { page: safePage })
}

export async function searchMovieList({ q, page = 1, genre, year, sort } = {}) {
  const query = String(q || '').trim()

  if (!query) {
    const error = new Error('Search query is required.')
    error.status = 400
    throw error
  }

  const safePage = Number(page) || 1

  if (safePage < 1) {
    const error = new Error('Page must be greater than or equal to 1.')
    error.status = 400
    throw error
  }

  const payload = await searchMovies({ q: query, page: safePage, genre, year, sort })
  return normalizePageResponse(payload, { page: safePage })
}

export async function getMovieByIdService(movieId) {
  const id = Number(movieId)

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Movie id must be a positive integer.')
    error.status = 400
    throw error
  }

  const movie = await getMovieById(id)
  return normalizeMovie(movie)
}
