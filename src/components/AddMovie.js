import React, { useState, useEffect } from "react";
import MovieDataService from "../services/MovieService";
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css';
import './style.css';

const TYPES = {
  MOVIE: "movie",
  TV: "tv",
}

const baseSearchUrl = "https://api.themoviedb.org/3/search/"

const AddMovie = () => {
  const initialMovieState = {
    title: "",
    description: "",
    type: TYPES.MOVIE,
    genres: [],
    samHasSeen: false,
    mayaHasSeen: false,
    fullPosterUrl: "",
    trailerUrl: "",
    notes: "",
    language: "",
  };
  const [movie, setMovie] = useState(initialMovieState);
  const [type, setType] = useState(TYPES.MOVIE)
  const [submitted, setSubmitted] = useState(false);
  const [movieSearchResults, setMovieSearchResults] = useState([]);
  const [genreResults, setGenreResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    getConfiguration()
      .then((data => setImageBaseUrl(data.images.base_url)));
  }, []);

  const getConfiguration = () => fetch(`https://api.themoviedb.org/3/configuration?api_key=d3449ff6ec0c027623bf6b6f5fff78b3`)
      .then(res=>res.json());

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleCheckboxChange = event => {
    const { name, checked } = event.target;
    setMovie({ ...movie, [name]: checked });
  };


  const getOptions = query => {
    if (type == TYPES.MOVIE) {
      return getMovieOptions(query);
    } else if (type == TYPES.TV) {
      return getTvOptions(query);
    } 
  }

  const getGenreOptions = query => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=abfd4e624c39e0d056de221df44caf93&language=en-US&page=1`)
        .then(response => response.json())
        .then(data => {
            setGenreResults(data.genres);
            resolve(data.genres.map(
              ({ id, name  }) => (
                { value: id, name: name }
              ) 
            ))
        })
        .catch(reject);
    });
  }

   const getLanguageOptions = query => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=d3449ff6ec0c027623bf6b6f5fff78b3`)
        .then(response => response.json())
        .then(data => {
            setLanguages(data);
            resolve(data.map(
              ({ iso_639_1, english_name  }) => (
                { value: iso_639_1, name: english_name }
              ) 
            ))
        })
        .catch(reject);
    });
  }

  const getMovieOptions = query => {
    return new Promise((resolve, reject) => {
      fetch(`${baseSearchUrl}movie?api_key=abfd4e624c39e0d056de221df44caf93&language=en-US&query=${query}&page=1`)
        .then(response => response.json())
        .then(data => {
            setMovieSearchResults(data.results);
            resolve(data.results.map(
              ({ id, title, release_date }) => (
                { value: id, name: title + `(${getReleaseYear(release_date)})` }
              )
            ))    
        })
        .catch(reject);
    });
  }

  const getTvOptions = query => {
    return new Promise((resolve, reject) => {
      fetch(`${baseSearchUrl}tv?api_key=abfd4e624c39e0d056de221df44caf93&language=en-US&query=${query}&page=1`)
        .then(response => response.json())
        .then(data => {
            setMovieSearchResults(data.results);
            resolve(data.results.map(
              ({ id, name, first_air_date }) => (
                { value: id, name: name + `(${getReleaseYear(first_air_date)})` }
              )
            ))
        })
        .catch(reject);
    });
  }

  const getMovie = (id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=d3449ff6ec0c027623bf6b6f5fff78b3&language=en-US`)
      .then(res=>res.json());
  };

  const getTvShow = (id) => {
    return fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=d3449ff6ec0c027623bf6b6f5fff78b3&language=en-US`)
      .then(res=>res.json());
  };

  const getMovieTrailer = (id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=d3449ff6ec0c027623bf6b6f5fff78b3&language=en-US`)
      .then(res=>res.json());
    };

  const getTvTrailer = (id) => {
    return fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=d3449ff6ec0c027623bf6b6f5fff78b3&language=en-US`)
      .then(res=>res.json());
  };

  const average = array => array.reduce((a, b) => a + b) / array.length;

  const onMovieSelect = (movieId) => {
    const selectedMovie = movieSearchResults.find(movie => movie.id == movieId)
    if (type == TYPES.MOVIE) {
      getMovie(selectedMovie.id).then(fullMovieData => {
        getMovieTrailer(selectedMovie.id).then(movieTrailerData => {
          setMovie({
            ...movie,
            title: selectedMovie.title,
            description: selectedMovie.overview,
            genres: selectedMovie.genre_ids,
            language: selectedMovie.original_language,
            year: getReleaseYear(selectedMovie.release_date),
            runtime: fullMovieData.runtime,
            fullPosterUrl: `${imageBaseUrl}w200${selectedMovie.poster_path}`,
            trailerUrl: `https://www.youtube.com/embed/${movieTrailerData.results.filter(result => result.site == "YouTube")[0].key}`, 
          })
        });
      })
      
    } else if (type == TYPES.TV) {
      getTvShow(selectedMovie.id).then(fullTvData => {
        getTvTrailer(selectedMovie.id).then(tvTrailerData => {
          setMovie({
            ...movie,
            title: selectedMovie.name,
            description: selectedMovie.overview,
            genres: selectedMovie.genre_ids,
            language: selectedMovie.original_language,
            year: getReleaseYear(selectedMovie.first_air_date),
            runtime: average(fullTvData.episode_run_time),
            fullPosterUrl: `${imageBaseUrl}w200${selectedMovie.poster_path}`,
            trailerUrl: `https://www.youtube.com/embed/${tvTrailerData.results.filter(result => result.site == "YouTube")[0].key}`, 
          })
        });
      })
    }
  }

  const onGenreSelect = (genres) => {
    setMovie({...movie, genres: genres})
  }

  const onLanguageSelect = (language) => {
    setMovie({...movie, language: language})
  }

  const saveMovie= () => {
    var data = {
      type: type,
      title: movie.title,
      description: movie.description,
      genres: movie.genres,
      language: movie.language,
      year: movie.year,
      runtime: movie.runtime,
      fullPosterUrl: movie.fullPosterUrl,
      trailerUrl: movie.trailerUrl,
      samHasSeen: movie.samHasSeen,
      mayaHasSeen: movie.mayaHasSeen,
    };

    MovieDataService.create(data)
      .then(() => {
        setSubmitted(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newMovie= () => {
    setMovie(initialMovieState);
    setSubmitted(false);
  };

  const getReleaseYear = date => {
    if(date&&date.includes('-')){
      return `${date.split('-')[0]}`
     }
  }

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newMovie}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label>
              <input
                type="radio"
                value={TYPES.MOVIE}
                checked={type === TYPES.MOVIE}
                name="type"
                onChange={() => setType(TYPES.MOVIE)}
              />
              Movie
            </label>
            <label>
              <input
                type="radio"
                value={TYPES.TV}
                checked={type === TYPES.TV}
                name="type"
                onChange={() => setType(TYPES.TV)}
              />
              TV
            </label>
          </div>
          <SelectSearch 
            getOptions={getOptions} 
            search={true}
            name="language" 
            placeholder={type === TYPES.MOVIE ? 'Search for a movie' : 'Search for a TV show'}
            onChange={onMovieSelect}
          />
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={movie.title}
              onChange={handleInputChange}
              name="title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="text"
              className="form-control"
              id="year"
              value={movie.year}
              onChange={handleInputChange}
              name="year"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              className="form-control"
              id="description"
              required
              value={movie.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="genres">Genres</label>
            <SelectSearch 
              value={movie.genres}
              getOptions={getGenreOptions} 
              search={true}
              name="language"
              multiple
              placeholder={"Search for genres"}
              onChange={onGenreSelect}
            />
          </div>
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <SelectSearch 
              value={movie.language}
              getOptions={getLanguageOptions} 
              search={true}
              name="language"
              placeholder={"Search for languages"}
              onChange={onLanguageSelect}
            />
          </div>
          <div className="form-group">
            <label htmlFor="runtime">{type == TYPES.MOVIE ? "Runtime" : "Average Episode Run Time"}</label>
            <input
              type="number"
              className="form-control"
              id="runtime"
              value={movie.runtime}
              onChange={handleInputChange}
              name="runtime"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                value={movie.samHasSeen}
                name="samHasSeen"
                onChange={handleCheckboxChange}
              />
              Sam Has Seen
            </label>
            <label>
              <input
                type="checkbox"
                value={movie.mayaHasSeen}
                name="mayaHasSeen"
                onChange={handleCheckboxChange}
              />
              Maya Has Seen
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="poster-url">Poster URL</label>
            <input
              type="text"
              className="form-control"
              id="posterUrl"
              value={movie.fullPosterUrl}
              onChange={handleInputChange}
              name="fullPosterUrl"
            />
          </div>
          {movie.fullPosterUrl && <img src={movie.fullPosterUrl} />}

          <div className="form-group">
            <label htmlFor="trailer-url">Trailer URL</label>
            <input
              type="text"
              className="form-control"
              id="trailerUrl"
              value={movie.trailerUrl}
              onChange={handleInputChange}
              name="trailerUrl"
            />
          </div>
          <iframe width="420" height="315"
            src={movie.trailerUrl}>
          </iframe>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              type="text"
              className="form-control"
              id="notes"
              required
              value={movie.notes}
              onChange={handleInputChange}
              name="notes"
            />
          </div>
          <button onClick={saveMovie} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMovie;
