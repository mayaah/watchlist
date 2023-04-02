import React, { useState, useEffect } from "react";
import MovieDataService from "../services/MovieService";
import {Route, Link, Routes, useParams} from 'react-router-dom';

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

  // const { movie } = props;

  const onDataChange = (item) => {
    let key = item.key;
    let data = item.val();
    let movieState = {
      key: key,
      title: data.title,
      description: data.description,
    };

    setMovie(movieState);
  };

  useEffect(() => {
    MovieDataService.get(params.id).on("value", onDataChange);

    return () => {
      MovieDataService.get(params.id).off("value", onDataChange);
    };
  }, []);

  // if (currentMovie.key !== movie.key) {
  //   setCurrentMovie(movie);
  //   setMessage("");
  // }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  // const updatePublished = (status) => {
  //   MovieDataService.update(currentMovie.key, { published: status })
  //     .then(() => {
  //       setCurrentMovie({ ...currentMovie, published: status });
  //       setMessage("The status was updated successfully!");
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  const updateMovie = () => {
    const data = {
      title: movie.title,
      description: movie.description,
    };

    MovieDataService.update(movie.key, data)
      .then(() => {
        setMessage("The movie was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteMovie = () => {
    MovieDataService.remove(movie.key)
      .then(() => {
        props.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {isEditing ? (
        <div className="edit-form">
          <h4>Movie</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={movie.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={movie.description}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteMovie}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateMovie}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <div>{movie.title}</div>
          <div>{movie.description}</div>
        </div>
      )}
    </div>
  );
};

export default Movie;
