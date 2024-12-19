import React from "react";
import Searching from "./jsx/Searching";
import MovieList from "./jsx/MovieList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/search" element={<Searching />} />
      </Routes>
    </Router>
  );
};

export default App;
