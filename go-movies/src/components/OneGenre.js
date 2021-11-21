import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useParams } from 'react-router';

export default function OneGenre(props) {
  const { id } = useParams()
  const location = useLocation().search
  const utm = new URLSearchParams(location)
  const genreName = utm.get("genreName")
  let [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  let [isLoaded, setIsLoaded] = useState(false);

  async function fetchGenres(id) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + id);
    if (response.status !== 200) {
      setError("Invalid response code: " + response.status)
      return
    }
    const res = await response.json(response);
    console.log(res);
    setMovies(res.movies);
    setIsLoaded(true);
  }

  useEffect(() => {
    fetchGenres(id);
    return () => {
    }
  }, [id, genreName])

  if (!movies) {
    setMovies([]);
  }

  if (error !== null) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Genre: {genreName}</h2>
        <div className="list-group">
          {movies.map((m) => (
            <Link to={`/movies/${m.id}`}
              className="list-group-item list-group-item-action"
              key={m.id}>
              {m.title}
            </Link>
          ))}
        </div>
      </Fragment >
    )
  }
}