const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function parseJsonResponse(response, fallbackMessage) {
  if (!response.ok) {
    throw new Error(fallbackMessage)
  }

  const payload = await response.json()
  return payload?.data ?? payload
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/health`)

  if (!response.ok) {
    throw new Error('Unable to reach the CineScope API')
  }

  return response.json()
}

export async function getMovies({ page = 1, genre = '', year = '', sort = 'popularity.desc', signal } = {}) {
  const params = new URLSearchParams({ page: String(page), sort })

  if (genre) params.set('genre', genre)
  if (year) params.set('year', String(year))

  const response = await fetch(`${API_BASE}/movies?${params.toString()}`, {
    signal,
  })

  const body = await parseJsonResponse(response, 'Unable to load movies right now.')

  return {
    movies: body?.movies || [],
    pagination: body?.pagination || { page: Number(page) || 1, totalPages: 1, totalResults: 0 },
  }
}

export async function searchMovies(query, page = 1, signal) {
  const trimmedQuery = String(query || '').trim()

  if (!trimmedQuery) {
    throw new Error('Search query is required.')
  }

  const params = new URLSearchParams({ q: trimmedQuery, page: String(page) })
  const response = await fetch(`${API_BASE}/movies/search?${params.toString()}`, {
    signal,
  })

  const body = await parseJsonResponse(response, 'Unable to search movies right now.')

  return {
    movies: body?.movies || [],
    pagination: body?.pagination || { page: Number(page) || 1, totalPages: 1, totalResults: 0 },
  }
}

export async function getMovieById(movieId, signal) {
  const response = await fetch(`${API_BASE}/movies/${encodeURIComponent(movieId)}`, { signal })
  return parseJsonResponse(response, 'Movie details are unavailable right now.')
}

export async function getWishlistMovies(signal) {
  const response = await fetch(`${API_BASE}/wishlist`, { signal })
  const body = await parseJsonResponse(response, 'Unable to load your wishlist right now.')
  return {
    movies: body?.movies || [],
  }
}

export async function addMovieToWishlist(movie, signal) {
  const response = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movie),
    signal,
  })

  const body = await parseJsonResponse(response, 'Unable to save this movie to your wishlist.')
  return body
}

export async function removeMovieFromWishlist(movieId, signal) {
  const response = await fetch(`${API_BASE}/wishlist/${encodeURIComponent(movieId)}`, {
    method: 'DELETE',
    signal,
  })

  return parseJsonResponse(response, 'Unable to remove this movie from your wishlist.')
}
