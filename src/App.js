import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/movies" className="navbar-brand">
          Watchlist
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/movies"} className="nav-link">
              Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <h2>Watchlist</h2>
        <Routes>
          <Route exact path="/" element={<MoviesList />} />
          <Route exact path="/movies" element={<MoviesList />} />
          <Route exact path="/add" element={<AddMovie />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;