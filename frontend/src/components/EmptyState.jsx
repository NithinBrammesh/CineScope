function EmptyState({ message = 'No movies found.' }) {
  return <div className="state-box empty-state">{message}</div>
}

export default EmptyState
