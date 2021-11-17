import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router';


export default function OneMovie(props) {
  const { id } = useParams()
  const defaultData = {
    movie: {
    },
    isLoaded: false,
    error: null,
  }
  const [data, setData] = useState(defaultData)

  useEffect(() => {
    async function fetchEmployees() {
      const response = await fetch("http://localhost:4000/v1/movie/" + id);
      if (response.status !== 200) {
        let err = Error;
        err.message = "Invalid response code: " + response.status
        setData({ error: err });
        return
      }
      const data = await response.json(response);
      setData({ movie: data.movie, isLoaded: true });
    }
    fetchEmployees();
    return () => {
    }
  }, [id])

  if (data.movie.genres) {
    data.movie.genres = Object.values(data.movie.genres);
  } else {
    data.movie.genres = [];
  }

  if (data.error) {
    return <div>Error: {data.error.message}</div>
  } else if (!data.isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Movie: {data.movie.title} ({data.movie.year})</h2>

        <div className="float-start">
          <small>Rating: {data.movie.mpaa_rating}</small>
        </div>
        <div className="float-end">
          {data.movie.genres.map((m, index) => (
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
              <td>{data.movie.title}</td>
            </tr>
            <tr>
              <td><strong>Description</strong></td>
              <td>{data.movie.description}</td>
            </tr>
            <tr>
              <td><strong>Runtime:</strong></td>
              <td>{data.movie.runtime} minutes</td>
            </tr>
          </tbody>
        </table>
      </Fragment >
    )
  }
}
