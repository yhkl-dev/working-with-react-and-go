import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Movies from "./components/Movies";
import Home from "./components/Home";
import Admin from "./components/Admin";
import OneMovie from "./components/OneMovie";
import Genres from "./components/Genres";
import OneGenre from "./components/OneGenre";
import EditMovie from "./components/EditMovie";
import { useState } from "react";
import Login from "./components/Login";
import GraphQL from "./components/GraphQL";
import OneMovieGraphQL from "./components/OneMovieGraphQL";


export default function App() {

  let loginLink;
  let defaultData = {
    jwt: ""
  }
  const [data, setdata] = useState(defaultData)

  const handleJWTChange = (jwt) => {
    setdata({ jwt: jwt })
  }

  const logout = () => {
    setdata({ jwt: "" })
    window.localStorage.removeItem("jwt");
  }

  if (data.jwt === "") {
    loginLink = <Link to="/login">Login</Link>
  } else {
    loginLink = <Link to="/logout" onClick={logout}>Logout</Link>
  }

  useEffect(() => {
    let t = window.localStorage.getItem("jwt")
    if (t) {
      if (data.jwt === "") {
        setdata({ jwt: JSON.parse(t) })
      }
    }
    return () => {
    }
  }, [data])

  return (
    <Router>
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">
              Go Watch a Movie!
            </h1>
          </div>
          <div className="col mt-3 text-end">
            {loginLink}
          </div>
          <hr className="mb-3"></hr>
        </div>

        <div className="row">
          <div className="col-md-2">
            <nav>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/movies">Movies</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/genres">Geners</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/graphql">GraphQL</Link>
                </li>
                {data.jwt !== "" && (
                  <Fragment>
                    <li className="list-group-item">
                      <Link to="/admin/movie/0">Add movie</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/admin">Manage Catalogue</Link>
                    </li>
                  </Fragment>
                )}
              </ul>
            </nav>
          </div>

          <div className="col-md-10">
            <Routes>
              <Route path="/movies" element={<Movies />} />
              <Route exact path="/movies/:id" element={<OneMovie />} />
              <Route exact path="/moviesgraphql/:id" element={<OneMovieGraphQL />} />
              <Route exact path="/genre/:id" element={<OneGenre />} />
              <Route exact path="/genres" element={<Genres />} />
              <Route exact path="/graphql" element={<GraphQL />} />
              <Route exact path="/login" element={<Login handleJWTChange={handleJWTChange} />} />
              <Route path="/admin" element={<Admin jwt={data.jwt} />} />
              <Route path="/admin/movie/:id" element={<EditMovie jwt={data.jwt} />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router >
  );
}
