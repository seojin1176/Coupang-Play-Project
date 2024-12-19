import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cupang_logo from "../img/Cupang_Play_Logo.png";
import axios from "axios";

const API_KEY = "261be3ca48bbe6daa2d5225421016ed0";

function Searching() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setBgColor(scrollY > 0 ? "black" : "transparent");
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    try {
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(
          searchTerm
        )}`
      );
      const tvResponse = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(
          searchTerm
        )}`
      );

      const combinedResults = [
        ...movieResponse.data.results,
        ...tvResponse.data.results,
      ];

      const prioritizedResults = combinedResults.sort((a, b) => {
        const isAAnime = a.original_language === "ja";
        const isBAnime = b.original_language === "ja";
        const isAKorean = a.original_language === "ko";
        const isBKorean = b.original_language === "ko";

        if (isAKorean && !isBKorean) return -1;
        if (!isAKorean && isBKorean) return 1;
        if (isAAnime && !isBAnime) return -1;
        if (!isAAnime && isBAnime) return 1;

        return 0;
      });

      setSearchResults(prioritizedResults);
    } catch (error) {
      console.error("Error searching for content", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrap">
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "75px",
          backgroundColor: bgColor,
          transition: "background-color 0.3s ease",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="wrap2">
          <div className="logo">
            <Link to="/">
              <img
                src={Cupang_logo}
                alt="Cupang_Play_Logo"
                style={{ width: "200px", height: "150px" }}
              />
            </Link>
          </div>
          <div className="category">
            <h3>TV</h3>
            <h3>영화</h3>
            <h3>스포츠</h3>
            <h3>스토어</h3>
            <h3>키즈</h3>
            <h3>라이브</h3>
          </div>
        </div>
        <div className="wrap3">
          <div className="all-category"></div>

          <div className="profile"></div>
        </div>
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="영화, 애니메이션, 드라마 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>
      <div className="movie-grid">
        {searchResults.map((item) => (
          <div key={item.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="movie-image"
            />
            <h3>{item.title || item.name}</h3>
            <p>{item.release_date || item.first_air_date}</p>
            <p>{item.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Searching;
