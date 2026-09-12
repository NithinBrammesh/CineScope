export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  })
}

export function globalErrorHandler(error, _req, res, _next) {
  console.error(error)

  const statusCode = error.status || 500

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
  })
}
