import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import { addMovieToWishlist, getMovieById, getWishlistMovies, removeMovieFromWishlist } from '../services/api.js'

const FALLBACK_POSTER = 'https://via.placeholder.com/300x450?text=No+Poster'

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wishlisted, setWishlisted] = useState(false)
  const [saving, setSaving] = useState(false)

  const detailImage = useMemo(() => {
    if (!movie) return ''
    return movie.backdropUrl || movie.posterUrl || FALLBACK_POSTER
  }, [movie])

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    async function loadMovie() {
      setLoading(true)
      setError('')

      try {
        const detail = await getMovieById(id, controller.signal)
        if (!isMounted) return
        setMovie(detail)
      } catch (loadError) {
        if (loadError.name === 'AbortError') return
        if (isMounted) {
          setError(loadError.message || 'Could not load that movie.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMovie()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    const controller = new AbortController()

    getWishlistMovies(controller.signal)
      .then(({ movies }) => {
        const ids = new Set((movies || []).map((entry) => Number(entry.movieId)))
        setWishlisted(ids.has(Number(id)))
      })
      .catch(() => {
        setWishlisted(false)
      })

    return () => controller.abort()
  }, [id])

  const handleWishlistToggle = async () => {
    if (!movie || saving) return

    setSaving(true)
    setError('')

    try {
      if (wishlisted) {
        const response = await removeMovieFromWishlist(movie.id)
        if (response?.data?.removed === false && response?.data?.movieId) {
          setWishlisted(false)
        } else {
          setWishlisted(false)
        }
      } else {
        const payload = {
          movieId: movie.id,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
        }
        await addMovieToWishlist(payload)
        setWishlisted(true)
      }
    } catch (wishlistError) {
      setError(wishlistError.message || 'Unable to update your wishlist right now.')
    } finally {
      setSaving(false)
    }
  }

  const handleRetry = () => {
    navigate(0)
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={handleRetry} />
  if (!movie) return <ErrorState message="This movie could not be found." onRetry={handleRetry} />

  return (
    <main className="movie-details-page">
      <section className="movie-hero">
        <img
          src={detailImage}
          alt={movie.title}
          className="movie-hero-image"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_POSTER
          }}
        />

        <div className="movie-detail-content">
          <div className="movie-detail-poster">
            <img
              src={movie.posterUrl || FALLBACK_POSTER}
              alt={movie.title}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_POSTER
              }}
            />
          </div>

          <div className="movie-detail-body">
            <h2>{movie.title}</h2>
            <div className="movie-detail-meta">
              <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</span>
              <span>⭐ {Number(movie.rating || 0).toFixed(1)}</span>
              <span>{movie.voteCount ? `${movie.voteCount.toLocaleString()} votes` : 'No votes yet'}</span>
            </div>

            <p>{movie.overview || 'No overview available for this movie.'}</p>

            <div className="wishlist-actions">
              <button
                type="button"
                className={`wishlist-button ${wishlisted ? 'secondary' : ''}`}
                onClick={handleWishlistToggle}
                disabled={saving}
              >
                {saving ? 'Please wait...' : wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/" className="nav-link">
          Back to discover
        </Link>
      </div>
    </main>
  )
}

export default MovieDetails
