import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlus } from '@fortawesome/free-solid-svg-icons'
import Movie from "./components/Movie";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand">
        <div className="navbar-nav ms-auto me-3">
          <li className="nav-item">
            <Link to={"/movies"} className="nav-link">
              <FontAwesomeIcon icon={faList} size="lg" inverse />
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              <FontAwesomeIcon icon={faPlus} size="lg" inverse />
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Link to={"/movies"}>
          <h1 style={{textAlign: "center"}}>WATCHLIST</h1>
        </Link> 
        <Routes>
          <Route exact path="/" element={<MoviesList />} />
          <Route exact path="/movies" element={<MoviesList />} />
          <Route exact path="/add" element={<AddMovie />} />
          <Route path="/movie/:id" element={<Movie />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;