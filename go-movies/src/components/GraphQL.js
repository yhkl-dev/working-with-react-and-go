import React, { Fragment } from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from './form-components/input';


const defaultAlert = {
  type: "d-done",
  message: ""
}


export default function GraphQL() {
  const [movies, setmovies] = useState([]);
  const [searchItem, setsearchItem] = useState("");
  const [loaded, setloaded] = useState(false);
  const [alert, setalert] = useState(defaultAlert);
  const [errorInfo, seterrorInfo] = useState(null);

  async function fetchMovies(payload, queryType) {
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json")
    const requestOptions = {
      method: "POST",
      body: payload,
      headers: myHeaders
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, requestOptions)
    const result = await response.json(response);
    let theList = queryType === "search" ? Object.values(result.data.search) : Object.values(result.data.list);
    console.log(theList);
    if (theList.length > 0) {
      setmovies(theList)
    } else {
      setmovies([]);
    }
    setloaded(true);
  }

  const handleChange = (event) => {
    let value = event.target.value;
    setsearchItem(value);
    if (value.length > 2) {
      performSearch();
    } else {
      setmovies([]);
    }

  }

  function performSearch() {
    const payload = `
    {
      search(titleContains: "${searchItem}") {
        id
        title
        runtime
        year
        description
      }
    }
    `
    fetchMovies(payload, "search")
  }

  useEffect(() => {
    const payload = `
    {
      list {
        id
        title
        runtime
        year
        description
      }
    }
    `
    fetchMovies(payload, "list")
    return () => {
    }
  }, [])
  return (
    <Fragment>
      <h2>GraphQL</h2>
      <hr></hr>
      <Input title={"Search"} type={"text"} name={"search"} value={searchItem} handleChange={handleChange}></Input>
      <div className="list-group">
        {movies.map((m) => (
          <Link key={m.id} className="list-group-item list-group-item-action" to={`/moviesgraphql/${m.id}`}>
            <strong>{m.title}</strong>
            <br />
            <small className="text-muted">
              ({m.year}) - {m.runtime} minutes
            </small>
            <br></br>
            {m.description.slice(0, 100)}
          </Link>
        ))}
      </div>
    </Fragment>
  )
}