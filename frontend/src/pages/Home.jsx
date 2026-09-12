import { useEffect, useMemo, useRef, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import FilterBar from '../components/FilterBar.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'
import SortSelector from '../components/SortSelector.jsx'
import { getMovies, searchMovies } from '../services/api.js'

function Home() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('popularity.desc')
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef(null)
  const isSearchMode = query.trim().length > 0

  const params = useMemo(
    () => ({
      page,
      genre,
      year,
      sort,
    }),
    [page, genre, year, sort],
  )

  useEffect(() => {
    if (!query.trim()) {
      const controller = new AbortController()
      abortRef.current?.abort()
      abortRef.current = controller
      setLoading(true)
      setError('')

      getMovies({ ...params, signal: controller.signal })
        .then((payload) => {
          setMovies(payload?.movies || [])
          setPagination(payload?.pagination || { page: 1, totalPages: 1, totalResults: 0 })
        })
        .catch((fetchError) => {
          if (fetchError.name === 'AbortError') return
          setError(fetchError.message || 'Unable to load movies right now.')
          setMovies([])
        })
        .finally(() => {
          setLoading(false)
        })

      return () => controller.abort()
    }

    const timer = setTimeout(() => {
      const controller = new AbortController()
      abortRef.current?.abort()
      abortRef.current = controller
      setLoading(true)
      setError('')

      searchMovies(query, page, controller.signal)
        .then((payload) => {
          setMovies(payload?.movies || [])
          setPagination(payload?.pagination || { page: 1, totalPages: 1, totalResults: 0 })
        })
        .catch((fetchError) => {
          if (fetchError.name === 'AbortError') return
          setError(fetchError.message || 'Unable to search movies right now.')
          setMovies([])
        })
        .finally(() => {
          setLoading(false)
        })
    }, 400)

    return () => clearTimeout(timer)
  }, [query, page, genre, year, sort])

  useEffect(() => {
    if (!isSearchMode) {
      setPage(1)
    }
  }, [query, genre, year, sort, isSearchMode])

  const handleRetry = () => {
    setError('')
    setPage(1)
  }

  const showEmpty = !loading && !error && movies.length === 0

  return (
    <main className="home-page">
      <header className="topbar">
        <div>
          <p className="brand-kicker">CineScope</p>
          <h1>Discover movies</h1>
        </div>
      </header>

      <section className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
      </section>

      <section className="controls-row">
        <FilterBar
          genre={genre}
          year={year}
          onGenreChange={(value) => {
            setGenre(value)
            setPage(1)
          }}
          onYearChange={(value) => {
            setYear(value)
            setPage(1)
          }}
        />
        <SortSelector
          value={sort}
          onChange={(value) => {
            setSort(value)
            setPage(1)
          }}
        />
      </section>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : showEmpty ? (
        <EmptyState message="No movies found." />
      ) : (
        <>
          <div className="results-header">
            <strong>{pagination.totalResults} results</strong>
          </div>
          <MovieGrid movies={movies} />

          <div className="pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} / {pagination.totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage((current) => Math.min(pagination.totalPages || current + 1, current + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default Home
