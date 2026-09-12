function SearchBar({ value, onChange, placeholder = 'Search movies...' }) {
  return (
    <div className="search-bar-wrap">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="search-bar"
      />
    </div>
  )
}

export default SearchBar
