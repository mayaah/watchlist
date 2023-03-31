import React, { useState, useEffect } from "react";
import { useList } from "react-firebase-hooks/database";
import MovieDataService from "../services/MovieService";
import Movie from "./Movie";

const MoviesList = () => {
   /* use react-firebase-hooks */
  // const [movies, loading, error] = useList(MovieDataService.getAll());
  const [movies, setMovies] = useState([]);
  let loading=false;
  let error="";
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const onDataChange = (items) => {
    let movies = [];

    items.forEach((item) => {
      let key = item.key;
      let data = item.val();
      movies.push({
        key: key,
        title: data.title,
        description: data.description,
      });
    });

    setMovies(movies);
  };

  useEffect(() => {
    MovieDataService.getAll().on("value", onDataChange);

    return () => {
      MovieDataService.getAll().off("value", onDataChange);
    };
  }, []);

  const refreshList = () => {
    setCurrentMovie(null);
    setCurrentIndex(-1);
  };

  const setActiveMovie = (movie, index) => {
    const { title, description } = movie;

    setCurrentMovie({
      key: movie.key,
      title,
      description,
    });

    setCurrentIndex(index);
  };

  const removeAllMovies = () => {
    MovieDataService.removeAll()
      .then(() => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
     <div className="list row">
      <div className="col-md-6">
        <h4>Movies List</h4>

        {error && <strong>Error: {error}</strong>}
        {loading && <span>Loading...</span>}
        <ul className="list-group">
          {!loading &&
            movies &&
            movies.map((movie, index) => (
              <li
                className={"list-group-item " + (index === currentIndex ? "active" : "")}
                onClick={() => setActiveMovie(movie, index)}
                key={index}
              >
                {movie.title}
              </li>
            ))} 
        </ul>

      </div>
      <div className="col-md-6">
        {currentMovie ? (
          <Movie movie={currentMovie} refreshList={refreshList} />
        ) : (
          <div>
            <br />
            <p>Please click on a Movie...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
