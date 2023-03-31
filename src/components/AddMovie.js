import React, { useState } from "react";
import MovieDataService from "../services/MovieService";

const AddMovie = () => {
  const initialMovieState = {
    title: "",
    description: "",
  };
  const [movie, setMovie] = useState(initialMovieState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  const saveMovie= () => {
    var data = {
      title: movie.title,
      description: movie.description,
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
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={movie.description}
              onChange={handleInputChange}
              name="description"
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
