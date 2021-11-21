import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';


export default function Genres() {
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null);
  async function fetchGenres() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/genres`);
    if (response.status !== 200) {
      setError("Invalid response code: " + response.status)
      return
    }
    const data = await response.json(response);
    setGenres(data.genres)
  }

  useEffect(() => {
    fetchGenres();
    return () => {
    }
  }, [])

  if (error !== null) {
    return <div>Error: {error}</div>
  } else {
    return (
      <Fragment>
        <h2>Genres</h2>
        <div className="list-group">
          {genres.map((m) => (
            <Link className="list-group-item list-group-item-action"
              key={m.id} to={{ pathname: `/genre/${m.id}`, search: `genreName=${m.genre_name}` }} >
              {m.genre_name}
            </Link>
          ))}
        </div>
      </Fragment >
    )
  }
}