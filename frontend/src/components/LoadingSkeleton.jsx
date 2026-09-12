function LoadingSkeleton() {
  return (
    <div className="loading-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="loading-card" />
      ))}
    </div>
  )
}

export default LoadingSkeleton
