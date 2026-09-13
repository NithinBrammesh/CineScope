import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import ScrollToTop from './ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Wishlist from './pages/Wishlist.jsx'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <nav className="top-nav" aria-label="Main navigation">
          <Link to="/" className="nav-link">
            Discover
          </Link>
          <Link to="/wishlist" className="nav-link">
            Wishlist
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
