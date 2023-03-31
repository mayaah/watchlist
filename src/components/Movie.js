import React, { useState } from "react";
import MovieDataService from "../services/MovieService";

const Movie = (props) => {
  const initialMovieState = {
    key: null,
    title: "",
    description: "",
  };
  const [currentMovie, setCurrentMovie] = useState(initialMovieState);
  const [message, setMessage] = useState("");

  const { movie } = props;
  if (currentMovie.key !== movie.key) {
    setCurrentMovie(movie);
    setMessage("");
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentMovie({ ...currentMovie, [name]: value });
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
      title: currentMovie.title,
      description: currentMovie.description,
    };

    MovieDataService.update(currentMovie.key, data)
      .then(() => {
        setMessage("The movie was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteMovie = () => {
    MovieDataService.remove(currentMovie.key)
      .then(() => {
        props.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentMovie ? (
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
                value={currentMovie.title}
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
                value={currentMovie.description}
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
          <br />
          <p>Please click on a Movie...</p>
        </div>
      )}
    </div>
  );
};

export default Movie;
