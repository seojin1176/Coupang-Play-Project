import React, { useEffect, useState } from "react";
import "../css/App.css";
import dotbogi from "../img/dotbogi.png";
import Cupang_logo from "../img/Cupang_Play_Logo.png";
import axios from "axios";
import { Link } from "react-router-dom";

const API_KEY = "261be3ca48bbe6daa2d5225421016ed0"; // TMDB API 키

const MovieList = () => {
  const [popularContent, setPopularContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [bgColor, setBgColor] = useState("transparent");

  const ITEMS_PER_PAGE = 6; // 한 페이지에 표시할 항목 수

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

  useEffect(() => {
    fetchPopularContent();
  }, []);

  const fetchPopularContent = async () => {
    try {
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR`
      );
      const tvResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=ko-KR`
      );

      const combinedResults = [
        ...movieResponse.data.results,
        ...tvResponse.data.results,
      ];

      const prioritizedResults = combinedResults.filter(
        (item) =>
          item.original_language === "ko" ||
          item.original_language === "ja" ||
          item.original_language === "en"
      );

      setPopularContent(prioritizedResults);
    } catch (error) {
      console.error("Error fetching popular content", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // 현재 페이지 데이터 계산
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = popularContent.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < popularContent.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          <div className="search">
            <Link to="/search">
              <img
                src={dotbogi}
                alt="Dot Bogi"
                style={{ width: "50px", height: "50px" }}
              />
            </Link>
          </div>
          <div className="profile"></div>
        </div>
      </div>

      {/* 영화 슬라이더 */}
      <div className="movie-slider">
        <button
          className="slider-button"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        <div className="movie-slider-container">
          {currentItems.map((item) => (
            <div key={item.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="movie-poster"
              />
              <h3>{item.title || item.name}</h3>
            </div>
          ))}
        </div>
        <button
          className="slider-button"
          onClick={nextPage}
          disabled={endIndex >= popularContent.length}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MovieList;
