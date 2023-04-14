import React, { useState, useEffect } from "react";
import MovieDataService from "../services/MovieService";
import SelectSearch from 'react-select-search';
import EditMovie from './EditMovie';
import 'react-select-search/style.css';
import './style.css';

const TYPES = {
  MOVIE: "movie",
  TV: "tv",
}

const baseSearchUrl = "https://api.themoviedb.org/3/search/"

const AddMovie = () => {

  return (
    <EditMovie isNew={true} />
  );
};

export default AddMovie;
