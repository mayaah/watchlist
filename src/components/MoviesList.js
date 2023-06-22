import React, { useState, useEffect } from "react";
import { useList } from "react-firebase-hooks/database";
import {Route, Link, Routes, useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import MovieDataService from "../services/MovieService";
import Movie from "./Movie";
import MovieTile from "./MovieTile";

const MoviesList = () => {
   /* use react-firebase-hooks */
  // const [movies, loading, error] = useList(MovieDataService.getAll());
  const [movies, setMovies] = useState([]);
  let error="";
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [actualMovies, setActualMovies] = useState([]);
  const [filterLessThanTwoHours, setFilterLessThanTwoHours] = useState(false);
  const [tvShows, setTvShows] = useState([]);
  const [watched, setWatched] = useState([]);

  const TYPES = {
    MOVIE: "movie",
    TV: "tv",
  }
  const handleChange=(e)=>{
   setFilterLessThanTwoHours(!filterLessThanTwoHours)
  }

  const onDataChange = (items) => {
    let movies = [];

    items.forEach((item) => {
      let key = item.key;
      let data = item.val();
      movies.push({
        key: key,
        title: data.title,
        description: data.description,
        type: data.type,
        fullPosterUrl: data.fullPosterUrl,
        mayaHasSeen: data.mayaHasSeen,
        samHasSeen: data.samHasSeen,
        watchedDate: data.watchedDate,
        runtime: data.runtime,
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

  useEffect(() => {
    let filteredMovies = movies;
    if (filterLessThanTwoHours) {
      filteredMovies = movies.filter((movie) => {
        return movie.runtime < 120
      })
    }

    setActualMovies(filteredMovies.filter((movie) => {
      return movie.type == TYPES.MOVIE && movie.watchedDate === undefined
    }))

    setTvShows(filteredMovies.filter((movie) => {
      return movie.type == TYPES.TV && movie.watchedDate === undefined
    }))

    setWatched(filteredMovies.filter((movie) => {
      return movie.watchedDate !== undefined
    }))
  }, [movies, filterLessThanTwoHours]);

  const refreshList = () => {
    setCurrentMovie(null);
    setCurrentIndex(-1);
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
    <div style={{marginBottom: "75px"}}>
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="filterLessThanTwoHours"
          checked={filterLessThanTwoHours}
          value={filterLessThanTwoHours}
          onChange={handleChange}
        />
        <label class="form-check-label" for="filterLessThanTwoHours">Less Than Two Hours</label>
      </div>

      <MovieTile headerTitle="MOVIES" movies={actualMovies} />

      <MovieTile headerTitle="TV" movies={tvShows} />

      <MovieTile headerTitle="WATCHED" movies={watched} />
     </div>
  );
};

export default MoviesList;
