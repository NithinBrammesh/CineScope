import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import MovieCard from '../components/MovieCard.jsx'
import { getWishlistMovies, removeMovieFromWishlist } from '../services/api.js'

function Wishlist() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const controllerRef = useRef(null)

  async function loadWishlist() {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError('')

    try {
      const { movies: savedMovies } = await getWishlistMovies(controller.signal)
      setMovies(savedMovies)
    } catch (loadError) {
      if (loadError.name !== 'AbortError') {
        setError(loadError.message || 'Unable to load your wishlist right now.')
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadWishlist()

    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  const handleRemove = async (movieId) => {
    try {
      await removeMovieFromWishlist(movieId)
      setMovies((current) => current.filter((movie) => Number(movie.movieId) !== Number(movieId)))
    } catch (removeError) {
      setError(removeError.message || 'Unable to remove this movie.')
    }
  }

  const handleRetry = () => {
    loadWishlist()
  }

  const normalizedWishlistMovies = movies.map((movie) => ({
    id: Number(movie.movieId),
    title: movie.movieTitle || 'Untitled movie',
    posterUrl: movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster',
    releaseDate: movie.releaseDate || movie.release_date || '',
    rating: movie.rating ?? 0,
    voteCount: movie.voteCount ?? 0,
  }))

  return (
    <main className="wishlist-page">
      <header className="topbar">
        <div>
          <p className="brand-kicker">CineScope</p>
          <h1>Wishlist</h1>
        </div>
      </header>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : normalizedWishlistMovies.length === 0 ? (
        <EmptyState message="Your wishlist is empty." />
      ) : (
        <section className="wishlist-section">
          <div className="movie-grid wishlist-grid">
            {normalizedWishlistMovies.map((movie) => (
              <div key={movie.id} className="wishlist-item">
                <Link to={`/movies/${movie.id}`} className="movie-card-link">
                  <MovieCard movie={movie} />
                </Link>
                <button
                  type="button"
                  className="wishlist-remove-button"
                  onClick={() => handleRemove(movie.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default Wishlist
