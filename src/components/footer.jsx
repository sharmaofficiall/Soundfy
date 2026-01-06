import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-shell">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="bg"></span>
            <div className="leading-tight">
              <span className="Musi text-2xl lg:text-3xl">Sound</span>
              <span className="fy text-2xl lg:text-3xl">fy</span>
            </div>
          </Link>
          <p className="footer-tagline">Curated sounds, smart search, and smooth playback—stay in the flow.</p>
          <div className="footer-actions">
            <Link to="/Browse" className="footer-cta">Start listening</Link>
            <a className="footer-ghost" href="mailto:hello@soundfy.app">hello@soundfy.app</a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-head">Explore</p>
            <Link to="/">Home</Link>
            <Link to="/Browse">Browse</Link>
            <Link to="/Music">My Music</Link>
            <Link to="/search/trending">Search</Link>
          </div>

          <div className="footer-col">
            <p className="footer-head">Library</p>
            <Link to="/Browse">New Releases</Link>
            <Link to="/Music">Playlists</Link>
            <Link to="/Music">Favorites</Link>
            <Link to="/Browse">Albums</Link>
          </div>

          <div className="footer-col">
            <p className="footer-head">Top Artists</p>
            <Link to={`/artists/459320`}>Arijit Singh</Link>
            <Link to={`/artists/456863`}>Badshah</Link>
            <Link to={`/artists/485956`}>Honey Singh</Link>
            <Link to={`/artists/468245`}>Diljit Dosanjh</Link>
            <Link to={`/artists/672167`}>Haardy Sandhu</Link>
            <Link to={`/artists/881158`}>Jubin Nautiyal</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Made with React & Vite • © 2026 Soundfy</span>
        <div className="footer-bottom-links">
          <Link to="/Browse">Discover</Link>
          <Link to="/Music">Library</Link>
          <Link to="/search/trending">Search</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
