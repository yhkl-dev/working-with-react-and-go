import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router';


const deaultMovie = {
  title: "",
  description: "",
  runtime: "",
  mpaa_rating: "",
  year: "",
  rating: "",
  genres: [],
}

export default function OneMovie() {
  const { id } = useParams()
  const [movie, setMovie] = useState(deaultMovie);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  async function fetchMovie(id) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/movie/` + id);
    if (response.status !== 200) {
      setError("Invalid response code: ", response.status)
      return
    }
    const data = await response.json(response);
    setMovie(data.movie);
    setIsLoaded(true);
  }

  useEffect(() => {
    fetchMovie(id);
    return () => {
    }
  }, [id])

  if (movie.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    movie.genres = [];
  }

  if (error !== null) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Movie: {movie.title} ({movie.year})</h2>

        <div className="float-start">
          <small>Rating: {movie.mpaa_rating}</small>
        </div>
        <div className="float-end">
          {movie.genres.map((m, index) => (
            <span className="badge bg-secondary me-1" key={index}>
              {m}
            </span>
          ))}
        </div>
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
