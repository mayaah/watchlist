import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

const MovieTile = (props) => {
  return (
    <>
      {props.movies.length > 0 && (
        <>
          <h4>{props.headerTitle}</h4>
          <div className="container">
            <div className="row g-4">
              {props.movies.map((movie, index) => (
                <div className="col-sm-4 col-4" key={index}>
                  <Link to={"/movie/" + movie.key}>
                    <img className="img-fluid" style={{ display: "block", margin: "0 auto",}} src={movie.fullPosterUrl}/>
                  </Link>
                  <div className="watched-icons">
                    {movie.samHasSeen && <img className="img-fluid" src={require('../assets/blue-eye.png')} />}
                    {movie.mayaHasSeen && <img className="img-fluid" src={require('../assets/pink-eye.png')} />}
                  </div>
                </div>
              ))}   
            </div>
          </div> 
        </>
      )}
    </> 
  );

};

export default MovieTile;