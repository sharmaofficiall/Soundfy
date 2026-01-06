import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { getArtistbyQuery, getSearchData, getSongbyQuery, getSuggestionSong } from "../../fetch";
import MusicContext from "../context/MusicContext";
import he from "he";
import Theme from "../../theme";
import { IoSearchOutline, IoClose } from "react-icons/io5";
const Navbar = () => {
  const { playMusic } = useContext(MusicContext);
  const [query, setQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState(() => {
    try {
      const saved = localStorage.getItem("recentQueries");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  let List = [];
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const shouldShowSuggestions = isFocused && (query.trim().length > 0 || suggestions.length > 0 || recentQueries.length > 0);
  const persistRecentQuery = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentQueries.filter((item) => item !== trimmed)].slice(0, 6);
    setRecentQueries(next);
    localStorage.setItem("recentQueries", JSON.stringify(next));
  };
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getSearchData(query);
      const song = await getSongbyQuery(query, 5);
      const artist = await getArtistbyQuery(query , 5);
      // console.log(artist);
      const allSuggestions = [];
      if (song?.data?.results) {
        allSuggestions.push(
          ...song.data.results.map((item) => ({
            type: "Song",
            name: item.name,
            id: item.id,
            duration: item.duration,
            artist: item.artists,
            image: item.image[2].url,
            downloadUrl: item.downloadUrl[4].url,
          }))
        );
      }
      if (result?.data?.albums?.results) {
        allSuggestions.push(
          ...result.data.albums.results.map((item) => ({
            type: "Album",
            name: item.title,
            id: item.id,
            artist: item.artist,
            image: item.image?.[2]?.url,
          }))
        );
      }
      if (result?.data?.playlists?.results) {
        allSuggestions.push(
          ...result.data.playlists.results.map((item) => ({
            type: "Playlist",
            name: item.title,
            id: item.id,
            image: item.image[2].url,
          }))
        );
      }
      if (artist?.data.results) {
        allSuggestions.push(
          ...artist.data.results.map((item) => ({
            type: item.type,
            name: item.name,
            id: item.id,
            image: item.image[2].url,
          }))
        );
      }

      setSuggestions(allSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSuggestionClick(suggestions[activeIndex]);
      return;
    }
    if (query.trim()) {
      persistRecentQuery(query);
      navigate(`/search/${query}`); // Navigate to the search results page
      setSuggestions([]); // Clear suggestions after search
      setActiveIndex(-1);
    }
  };


  const GetData = async(suggestion) => {
      const response = await getSuggestionSong(suggestion.id);
      const suggestedSongs = response.data || []; 
      return [suggestion, ...suggestedSongs];
  }

  const handleSuggestionClick = async (suggestion) => {
  if (suggestion.type === "Song") {
    List = await GetData(suggestion); 
  }
    persistRecentQuery(suggestion.name || query);
    switch (suggestion.type) {
      case "Song":
        playMusic(
          suggestion.downloadUrl,
          suggestion.name,
          suggestion.duration,
          suggestion.image,
          suggestion.id,
          suggestion.artist,
          List
        );
        break;
      case "Album":
        navigate(`/albums/${suggestion.id}`);
        break;
      case "artist":
      case "Artist":
        navigate(`/artists/${suggestion.id}`);
        break;
      case "Playlist":
        navigate(`/playlists/${suggestion.id}`);
        break;
      default:
        console.warn("Unknown suggestion type:", suggestion.type);
    }

    setQuery("");
    setSuggestions([]); // Clear suggestions
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (!shouldShowSuggestions) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(suggestions.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1;
        return prev <= 0 ? suggestions.length - 1 : prev - 1;
      });
    } else if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <nav className="navbar nav-surface fixed top-0 z-20 w-full">
      <div className="nav-inner mx-auto flex flex-col gap-4 lg:gap-5 px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="bg"></span>
            <div className="leading-tight">
              <span className="Musi text-2xl lg:text-3xl">Sound</span>
              <span className="fy text-2xl lg:text-3xl">fy</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 nav-links">
            <Link to="/Browse" className="nav-link">Browse</Link>
            <Link to="/Music" className="nav-link">My Music</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2 nav-links pr-1">
              <Link to="/Browse" className="nav-link">Browse</Link>
              <Link to="/Music" className="nav-link">My Music</Link>
            </div>
            <Theme />
          </div>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="search-shell"
          role="search"
          aria-label="Search for songs, artists, or playlists"
        >
          <div className="search-field">
            <IoSearchOutline className="text-xl search-icon" aria-hidden />
            {isLoading && <span className="search-spinner" aria-hidden />}
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search songs, artists, playlists, albums"
              className="search-input"
              value={query}
              onChange={handleSearchInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 120)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
            />
            {query && (
              <button
                type="button"
                className="clear-btn"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setActiveIndex(-1);
                }}
              >
                <IoClose />
              </button>
            )}
            <button type="submit" className="search-submit" aria-label="Submit search">
              <span className="hidden lg:inline">Search</span>
              <IoSearchOutline className="lg:hidden" />
            </button>
          </div>

          <div className="search-hint" aria-hidden>
            Try "lofi", "arijit singh", "bollywood mix" or hit Enter to search quickly.
          </div>

          <div
            className={`suggestionSection enhanced scroll-hide ${
              shouldShowSuggestions ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            {recentQueries.length > 0 && (
              <div className="recent-row">
                <span className="recent-label">Recent</span>
                <div className="recent-chips">
                  {recentQueries.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className="recent-chip"
                      onMouseDown={() => {
                        setQuery(item);
                        fetchSuggestions(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {suggestions.length === 0 && query.trim() ? (
              <div className="suggestion-empty">No matches yet. Keep typing…</div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${activeIndex === index ? "is-active" : ""}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  <img
                    src={suggestion.image}
                    alt={he.decode(suggestion.name)}
                    className="suggestion-cover"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="suggestion-title">{he.decode(suggestion.name)}</span>
                    <span className="suggestion-meta">{suggestion.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
