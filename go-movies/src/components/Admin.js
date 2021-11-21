import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export default function Admin({ jwt }) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false);

  async function fetchMovie() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
    if (response.status !== 200) {
      setError("Invalid response code: " + response.status);
      return
    }
    const result = await response.json(response);
    setMovies(result.movies);
    setIsLoaded(true);
  }
  useEffect(() => {
    if (jwt === "") {
      navigate("/login");
      return;
    }
    fetchMovie()
    return () => {
    }
  }, [jwt, navigate])

  if (error) {
    return <div>Error: {error}</div>
  }
  else if (!isLoaded) {
    return <p>Loading...</p>
  }
  return (
    <Fragment>
      <h2>Manage Catalogue</h2>
      <hr></hr>
      <div className="list-group">
        {movies.map((m) => (
          <Link className="list-group-item list-group-item-action"
            key={m.id} to={`/admin/movie/${m.id}`}>
            {m.title}
          </Link>
        ))}
      </div>
    </Fragment>
  )
}
