import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Movies() {
  const [movies, setMovie] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMovies() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/movies`);
    if (response.status !== 200) {
      setError("Invalid response code: " + response.status);
    }

    const result = await response.json(response);
    setMovie(result.movies);
    setIsLoaded(true);
  }

  useEffect(() => {
    fetchMovies()
    return () => {
    }
  }, [])

  if (error !== null) {
    return <div>Error: {error}</div>
  }
  else if (!isLoaded) {
    return <p>Loading...</p>
  }
  return (
    <Fragment>
      <h2>Choose a movie</h2>
      <div className="list-group">
        {movies.map((m) => (
          <Link className="list-group-item list-group-item-action" key={m.id} to={`/movies/${m.id}`}>{m.title}</Link>
        ))}
      </div>
    </Fragment>
  )
}
