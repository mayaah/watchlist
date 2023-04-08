import React, { useState, useEffect } from "react";
import { useList } from "react-firebase-hooks/database";
import {Route, Link, Routes, useParams} from 'react-router-dom';
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
    <>
      <h4>Movies List</h4> 
      <div className="container">
        <div className="row g-4">
          {!loading &&
            movies &&
            movies.filter((movie) => movie.type === TYPES.MOVIE).map((movie, index) => (
            <div className="col-sm-4 col-4" key={index}>
              <Link to={"/movie/" + movie.key}>
                <img className="img-fluid" style={{ display: "block", margin: "0 auto",}} src={movie.fullPosterUrl}/>
              </Link>
            </div>
          ))}   
        </div>
      </div>

      <h4>TV List</h4>
        <div className="container">
        <div className="row g-4">
          {!loading &&
            movies &&
            movies.filter((movie) => movie.type === TYPES.TV).map((movie, index) => (
            <div className="col-sm-4 col-4" key={index}>
              <Link to={"/movie/" + movie.key}>
                <img className="img-fluid" style={{ display: "block", margin: "0 auto",}} src={movie.fullPosterUrl}/>
              </Link>
            </div>
          ))}   
        </div>
      </div>   
     </>
  );
};

export default MoviesList;
