import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useParams } from 'react-router';

export default function OneGenre(props) {
  const { id } = useParams()
  const location = useLocation().search
  const utm = new URLSearchParams(location)
  const genreName = utm.get("genreName")
  const defaultData = {
    movies: [],
    isLoaded: false,
    error: null,
    genreName: utm.get("genreName"),
  }
  const [data, setData] = useState(defaultData)

  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + id);
      if (response.status !== 200) {
        let err = Error;
        err.message = "Invalid response code: " + response.status
        setData({ error: err });
        return
      }
      const data = await response.json(response);
      setData({ movies: data.movies, isLoaded: true, genreName: genreName });
    }
    fetchGenres();
    return () => {
    }
  }, [id, genreName])

  if (!data.movies) {
    data.movies = [];
  }

  if (data.error) {
    return <div>Error: {data.error.message}</div>
  } else if (!data.isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Genre: {data.genreName}</h2>
        <div className="list-group">
          {data.movies.map((m) => (
            <Link to={`/movies/${m.id}`} className="list-group-item list-group-item-action" key={m.id}>{m.title}</Link>
          ))}
        </div>
      </Fragment >
    )
  }
}