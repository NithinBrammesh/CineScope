import { Link } from 'react-router-dom'
import MovieCard from './MovieCard.jsx'

function MovieGrid({ movies = [] }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <Link key={movie.id} to={`/movies/${movie.id}`} className="movie-card-link">
          <MovieCard movie={movie} />
        </Link>
      ))}
    </div>
  )
}

export default MovieGrid
