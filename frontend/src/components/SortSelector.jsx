function SortSelector({ value, onChange }) {
  return (
    <label className="sort-selector">
      <span>Sort</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="popularity.desc">Popularity</option>
        <option value="vote_average.desc">Rating</option>
        <option value="primary_release_date.desc">Release date</option>
      </select>
    </label>
  )
}

export default SortSelector
