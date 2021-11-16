import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';


export default function Genres() {
  const defaultData = {
    genres: [],
    isLoaded: false,
    error: null,
  }

  const [data, setData] = useState(defaultData)

  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch("http://localhost:4000/v1/genres");
      if (response.status !== 200) {
        let err = Error;
        err.message = "Invalid response code: " + response.status
        setData({ genres: [], isLoaded: true, error: err });
        return
      }
      const data = await response.json(response);
      setData({ genres: data.genres, isLoaded: true });
    }
    fetchGenres();
    return () => {
    }
  }, [])
  return (
    <Fragment>
      <h2>Genres</h2>
      <ul>
        {data.genres.map((m) => (
          <li key={m.id}>
            <Link to={`/movie/${m.id}`} > {m.genre_name}</Link>
          </li>
        ))}
      </ul>
    </Fragment >
  )
}