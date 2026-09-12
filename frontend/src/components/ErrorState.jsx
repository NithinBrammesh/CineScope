function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box error-state">
      <p>{message || 'Something went wrong while loading movies.'}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="retry-button">
          Retry
        </button>
      ) : null}
    </div>
  )
}

export default ErrorState
