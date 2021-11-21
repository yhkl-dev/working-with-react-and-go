import React, { Fragment } from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';



export default function OneMovieGraphQL() {
  const { id } = useParams();
  const [movie, setmovie] = useState({});
  const [loaded, setloaded] = useState(false);
  const [errorInfo, seterrorInfo] = useState(null);

  async function fetchMovies(payload) {
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json")
    const requestOptions = {
      method: "POST",
      body: payload,
      headers: myHeaders
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, requestOptions)
    if (response.status !== 200) {
      let err = new Error();
      err.message = "Invalid response code: " + response.status;
      seterrorInfo(err);
      return;
    }
    const result = await response.json(response);
    setmovie(result.data.movie);
    setloaded(true);
  }

  useEffect(() => {
    const payload = `
    {
      movie(id: ${id}) {
        id
        title
        runtime
        year
        description
        release_date
        rating
        mpaa_rating
        poster
      }
    }
    `
    fetchMovies(payload, "list")
    return () => {
    }
  }, [id])

  if (errorInfo) {
    return <div>Error: {errorInfo.message}</div>
  } else if (!loaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Movie: {movie.title} ({movie.year})</h2>

        {movie.poster !== "" && (
          <div>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster}`} alt="poster" />
          </div>
        )}

        <div className="float-start">
          <small>Rating: {movie.mpaa_rating}</small>
        </div>
        {/* <div className="float-end">
          {movie.genres.map((m, index) => (
            <span className="badge bg-secondary me-1" key={index}>
              {m}
            </span>
          ))}
        </div> */}
        <div className="clearfix"></div>

        <hr></hr>

        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td><strong>Title:</strong></td>
              <td>{movie.title}</td>
            </tr>
            <tr>
              <td><strong>Description</strong></td>
              <td>{movie.description}</td>
            </tr>
            <tr>
              <td><strong>Runtime:</strong></td>
              <td>{movie.runtime} minutes</td>
            </tr>
          </tbody>
        </table>
      </Fragment >
    )
  }
}