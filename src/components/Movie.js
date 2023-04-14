import React, { useState, useEffect } from "react";
import MovieDataService from "../services/MovieService";
import {Route, Link, Routes, useParams} from 'react-router-dom';
import EditMovie from './EditMovie';

const Movie = (props) => {
  const params = useParams();
  const initialMovieState = {
    key: params.id,
    title: "",
    description: "",
  };
  const [movie, setMovie] = useState(initialMovieState);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [languageMap, setLanguageMap] = useState({});
  const [movieGenres, setMovieGenres] = useState({});
  const [tvGenres, setTvGenres] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const TYPES = {
    MOVIE: "movie",
    TV: "tv",
  }

  // const { movie } = props;

  const onDataChange = (item) => {
    let key = item.key;
    let data = item.val();
    if (data !== null) {
      let movieState = {
      key: key,
      title: data.title,
      description: data.description,
      fullPosterUrl: data.fullPosterUrl,
      genres: data.genres,
      language: data.language,
      mayaHasSeen: data.mayaHasSeen,
      samHasSeen: data.samHasSeen,
      runtime: data.runtime,
      trailerUrl: data.trailerUrl,
      type: data.type,
      year: data.year,
      watchedDate: data.watchedDate,
      notes: data.notes,
    };
    setMovie(movieState);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    getAndSetLanguageMap()
      .then(getAndSetMovieGenresMap())
      .then(getAndSetTvGenresMap())
      .then(MovieDataService.get(params.id).on("value", onDataChange))

    return () => {
      MovieDataService.get(params.id).off("value", onDataChange);
    };
  }, []);

  const getLanguages = () => fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=d3449ff6ec0c027623bf6b6f5fff78b3`)
    .then(res=>res.json());

  const getMovieGenres = () => fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=d3449ff6ec0c027623bf6b6f5fff78b3`)
    .then(res=>res.json());

  const getTvGenres = () => fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=d3449ff6ec0c027623bf6b6f5fff78b3`)
    .then(res=>res.json());

  const getAndSetLanguageMap = () => {
    return new Promise((resolve, reject) => {
      getLanguages()
        .then(data => {
          let returnObj = {}
          data.map(({ iso_639_1, english_name  }) => (
            returnObj[iso_639_1] = english_name
          ))
          setLanguageMap(returnObj);
          resolve();
        })
        .catch(reject);
    })
  };

  const getAndSetMovieGenresMap = () => {
    return new Promise((resolve, reject) => {
      getMovieGenres()
        .then(data => {
          let returnObj = {}
          data.genres.map(({ id, name  }) => (
            returnObj[id] = name
          ))
          setMovieGenres(returnObj);
        })
        .catch(reject);
    })
  };

  const getAndSetTvGenresMap = () => {
    return new Promise((resolve, reject) => {
      getTvGenres()
        .then(data => {
          let returnObj = {}
          data.genres.map(({ id, name  }) => (
            returnObj[id] = name
          ))
          setTvGenres(returnObj);
        })
        .catch(reject);
    })
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  const updateWatched = () => {
    const timestamp = Date.now()
    MovieDataService.update(movie.key, { watchedDate: timestamp })
      .then(() => {
        setMovie({ ...movie, watchedDate: timestamp });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const timeConvert = (number) => {
    const hours = (number / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + " m"
  };

  const displayGenres = (movie) => {
    let genres = movieGenres;
    if (movie.type == TYPES.TV) {
      genres = tvGenres;
    }
    return movie.genres.map((genreCode) => {
      return genres[genreCode]
    }).join(", ")
  };

  const setUpEditing = () => {
    MovieDataService.get(params.id).off("value", onDataChange);
    setIsEditing(true);
  };

  return (
    <div style={{marginBottom: "75px"}}>
      {isEditing ? (
        <div className="edit-form">
          <EditMovie movie={movie} isNew={false} />
        </div>
      ) : (
        <>
          {!isLoading && (
            <>
              <div className="mb-4 mt-4" style={{display: "flex", justifyContent: "end"}}>
                <button
                      className="badge badge-primary mr-2"
                      onClick={() => setUpEditing()}
                    >
                      Edit
                  </button>
                {movie.watchedDate === undefined ? (
                  <button
                    className="badge badge-primary mr-2"
                    onClick={() => updateWatched()}
                  >
                    Mark as Watched
                  </button>
                ) : (
                  <div>Date Watched: {Date(movie.watchedDate*1000)}</div>
                )}
              </div>
              <div className="movie-container">
              <img className="img-fluid mb-4" src={movie.fullPosterUrl}/>
              <div className="watched-icons">
                {movie.samHasSeen && <img className="img-fluid" src={require('../assets/white-blue-eye.png')} />}
                {movie.mayaHasSeen && <img className="img-fluid" src={require('../assets/white-pink-eye.png')} />}
              </div>
              <h5 className="mb-4">
                {movie.title} ({movie.year}) &#x2022; {displayGenres(movie)} &#x2022; {timeConvert(movie.runtime)} &#x2022;  {languageMap[movie.language]}
                </h5>
              <div className="mb-4">{movie.description}</div>
              {movie.notes && <div className="mb-4">Notes: {movie.notes}</div>}
              <div className="video-wrapper">
                <iframe width="560" height="349" src={movie.trailerUrl}>
                </iframe>
              </div>
            </div>
          </>
        )}
        </>
      )}
    </div>
  );
};

export default Movie;
