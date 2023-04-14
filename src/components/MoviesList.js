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
  const [tvShows, setTvShows] = useState([]);
  const [watched, setWatched] = useState([]);

  const TYPES = {
    MOVIE: "movie",
    TV: "tv",
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
    setActualMovies(movies.filter((movie) => {
      return movie.type == TYPES.MOVIE && movie.watchedDate === undefined
    }))

    setTvShows(movies.filter((movie) => {
      return movie.type == TYPES.TV && movie.watchedDate === undefined
    }))

    setWatched(movies.filter((movie) => {
      return movie.watchedDate !== undefined
    }))
  }, [movies]);

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
      <MovieTile headerTitle="MOVIES" movies={actualMovies} />

      <MovieTile headerTitle="TV" movies={tvShows} />

      <MovieTile headerTitle="WATCHED" movies={watched} />
     </div>
  );
};

export default MoviesList;
