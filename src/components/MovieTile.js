import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';


const MovieTile = (props) => {
  return (
    <>
      {props.movies.length > 0 && (
        <div className="container" style={{maxWidth: "700px", marginBottom: "40px"}}>
          <h4>{props.headerTitle}</h4>
          <div className="row g-4">
            {props.movies.map((movie, index) => (
              <div className="col-sm-4 col-4" key={index}>
                <Link to={"/movie/" + movie.key}>
                  <img className="img-fluid" style={{ display: "block", margin: "0 auto", width: "200px"}} src={movie.fullPosterUrl}/>
                </Link>
                <div className="watched-icons">
                  {movie.samHasSeen && <img className="img-fluid" src={require('../assets/white-blue-eye.png')} />}
                  {movie.mayaHasSeen && <img className="img-fluid" src={require('../assets/white-pink-eye.png')} />}
                </div>
              </div>
            ))}   
          </div>
        </div> 
      )}
    </> 
  );

};

export default MovieTile;