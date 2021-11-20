import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  const defaultData = {
    movies: [],
    idLoaded: false,
    error: null,
  }
  const [data, setdata] = useState(defaultData);
  async function fetchMovie() {
    const response = await fetch("http://localhost:4000/v1/movies")
    if (response.status !== 200) {
      let err = Error;
      err.message = "Invalid response code: " + response.status
      setdata({ error: err, isLoaded: true });
      return
    }
    const result = await response.json(response);
    setdata({
      movies: result.movies,
      isLoaded: true,
      error: null
    })
  }
  useEffect(() => {
    fetchMovie()
    return () => {
    }
  }, [])

  if (data.error) {
    return <div>Error: {data.error.message}</div>
  }
  else if (!data.isLoaded) {
    return <p>Loading...</p>
  }
  return (
    <Fragment>
      <h2>Manage Catalogue</h2>
      <div className="list-group">
        {data.movies.map((m) => (
          <Link className="list-group-item list-group-item-action" key={m.id} to={`/admin/movie/${m.id}`}>{m.title}</Link>
        ))}
      </div>
    </Fragment>
  )
}
