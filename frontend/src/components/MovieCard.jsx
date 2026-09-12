function MovieCard({ movie }) {
  if (!movie) return null

  return (
    <article className="movie-card">
      <div className="movie-poster-wrap">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster"
          onError={(event) => {
            event.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster'
          }}
        />
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
        </p>
        <p className="movie-rating">⭐ {Number(movie.rating || 0).toFixed(1)}</p>
      </div>
    </article>
  )
}

export default MovieCard
