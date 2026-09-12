import { env } from '../config/env.js'

const DEFAULT_TIMEOUT_MS = 15000
const genreMap = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciencefiction: 878,
  thriller: 53,
  war: 10752,
  western: 37,
}

function withStatus(message, status = 500) {
  const error = new Error(message)
  error.status = status
  return error
}

function buildUrl(path, params = {}) {
  const base = (env.tmdbBaseUrl || 'https://api.themoviedb.org/3').replace(/\/$/, '')
  const url = new URL(`${base}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  if (!env.tmdbAccessToken && env.tmdbApiKey) {
    url.searchParams.set('api_key', env.tmdbApiKey)
  }

  return url.toString()
}

async function requestTmdb(path, params = {}, timeoutMs = env.tmdbTimeoutMs || DEFAULT_TIMEOUT_MS) {
  const apiKey = env.tmdbApiKey
  const accessToken = env.tmdbAccessToken

  if (!apiKey && !accessToken) {
    throw withStatus(
      'TMDB authentication is not configured. Set TMDB_API_KEY or TMDB_ACCESS_TOKEN in the backend environment.',
      500,
    )
  }

  const headers = {
    Accept: 'application/json',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const maxRetries = 2

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(buildUrl(path, params), {
        method: 'GET',
        headers,
        signal: controller.signal,
      })

      const rawText = await response.text()
      let payload = null

      try {
        payload = rawText ? JSON.parse(rawText) : null
      } catch {
        payload = null
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw withStatus('TMDB authentication failed.', 401)
        }

        if (response.status === 404) {
          throw withStatus('The requested movie resource was not found.', 404)
        }

        if (response.status === 429) {
          throw withStatus('TMDB rate limit reached. Please try again later.', 429)
        }

        if (response.status >= 500) {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt))
            continue
          }

          throw withStatus('TMDB service is currently unavailable.', 502)
        }

        throw withStatus(payload?.status_message || 'TMDB request failed.', response.status || 500)
      }

      if (!payload || typeof payload !== 'object') {
        throw withStatus('Unexpected TMDB response format.', 502)
      }

      return payload
    } catch (error) {
      if (error.name === 'AbortError') {
        throw withStatus('TMDB request timed out.', 504)
      }

      if (error instanceof TypeError) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt))
          continue
        }

        throw withStatus('Unable to reach TMDB.', 502)
      }

      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export async function discoverMovies({ page = 1, genre, year, sort = 'popularity.desc' } = {}) {
  const normalizedPage = Number(page) || 1
  const normalizedGenre = genre ? String(genre).trim().toLowerCase() : ''
  const genreId = normalizedGenre ? genreMap[normalizedGenre] : undefined

  const query = {
    page: normalizedPage,
    include_adult: false,
    include_video: false,
    language: 'en-US',
    sort_by: sort || 'popularity.desc',
  }

  if (genreId) {
    query.with_genres = genreId
  }

  if (year) {
    query.primary_release_year = Number(year)
  }

  return requestTmdb('/discover/movie', query)
}

export async function searchMovies({ q = '', page = 1 } = {}) {
  const query = String(q || '').trim()

  if (!query) {
    throw withStatus('Search query is required.', 400)
  }

  return requestTmdb('/search/movie', {
    query,
    page: Number(page) || 1,
    include_adult: false,
    language: 'en-US',
  })
}

export async function getMovieById(movieId) {
  const id = Number(movieId)

  if (!Number.isInteger(id) || id <= 0) {
    throw withStatus('Movie id must be a positive integer.', 400)
  }

  return requestTmdb(`/movie/${id}`, {
    language: 'en-US',
  })
}
