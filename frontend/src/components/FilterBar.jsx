function FilterBar({ genre, year, onGenreChange, onYearChange }) {
  return (
    <div className="filter-bar">
      <label>
        <span>Genre</span>
        <select value={genre} onChange={(event) => onGenreChange(event.target.value)}>
          <option value="">All genres</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="thriller">Thriller</option>
          <option value="fantasy">Fantasy</option>
          <option value="adventure">Adventure</option>
          <option value="animation">Animation</option>
          <option value="sciencefiction">Science Fiction</option>
        </select>
      </label>

      <label>
        <span>Year</span>
        <input
          type="number"
          min="1900"
          max="2100"
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          placeholder="2024"
        />
      </label>
    </div>
  )
}

export default FilterBar
