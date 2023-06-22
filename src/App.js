import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MovieDataService from "./services/MovieService";
import { faList, faPlus, faRandom } from '@fortawesome/free-solid-svg-icons'
import Movie from "./components/Movie";
import { useNavigate } from "react-router-dom";

function App() {
  const [movieKeys, setMovieKeys] = useState([]);
  const navigate = useNavigate();

  const goToRandomMovie = () => {
    const randomIdx = Math.floor(Math.random() * movieKeys.length);
    let randomMovieKey = movieKeys[randomIdx];
    navigate("/movie/" + randomMovieKey);

  };

  const onDataChange = (items) => {
    let movies = [];

    items.forEach((item) => {
      let key = item.key;
      let data = item.val();
      if (data.watchedDate === undefined ){
        movieKeys.push(key);
      }
    });

    setMovieKeys(movieKeys);
  };

  useEffect(() => {
    MovieDataService.getAll().on("value", onDataChange);

    return () => {
      MovieDataService.getAll().off("value", onDataChange);
    };
  }, []);

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
          <li className="nav-item">
            <div onClick={() => goToRandomMovie()}className="nav-link">
              <FontAwesomeIcon icon={faRandom} size="lg" inverse />
            </div>
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
          <Route exact path="/random" element={<Movie />} />
          <Route exact path="/add" element={<AddMovie />} />
          <Route exact path="/movie/:id" element={<Movie />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;