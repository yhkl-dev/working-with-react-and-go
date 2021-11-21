import React, { useEffect, Fragment, useState } from 'react'
import { Input, TextInput } from './form-components/input'
import { Select } from './form-components/select'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Alert } from './ui-component/Alert'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import "./EditMovie.css"

const defaultAlert = {
  type: "d-none",
  message: "",
}

const defaultMovie = {
  id: 0,
  title: "",
  release_date: "",
  runtime: "",
  mpaa_rating: "",
  rating: "",
  description: ""
}

export default function EditMovie({ jwt }) {
  const navigate = useNavigate()
  const { id } = useParams();
  const [movie, setMovie] = useState(defaultMovie)
  const [error, setError] = useState(null)
  const [errorInfo, setErrorInfo] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [alertInfo, setalertInfo] = useState(defaultAlert);
  const MPAARating = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
  ];

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    setMovie((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = [];
    if (movie.title === "") {
      errors.push("title");
    }
    setErrorInfo(errors);
    if (errorInfo.length > 0) {
      return false;
    }
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    editMovie(payload);
  }

  async function editMovie(payload) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + jwt);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: myHeaders
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, requestOptions)
    const result = await response.json(response);
    if (result.error) {
      setalertInfo({ type: "alert-danger", message: result.error.message })
    } else {
      setalertInfo({ type: "alert-success", message: "Changes Saved" })
      navigate('/admin')
    }
    console.log(result);
  }

  async function fetchMovies(id) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/movie/` + id);
    if (response.status !== 200) {
      setError("Invalid response code: " + response.status)
      return
    }
    const res = await response.json(response);
    const releaseDate = new Date(res.movie.release_date);
    setMovie({
      id: id,
      title: res.movie.title,
      release_date: releaseDate.toISOString().split("T")[0],
      runtime: res.movie.runtime,
      mpaa_rating: res.movie.mpaa_rating,
      description: res.movie.description,
      rating: res.movie.rating
    });
    setIsLoaded(true);
  };

  function hasError(key) {
    return errorInfo.indexOf(key) !== -1;
  }

  const confirmDelete = (e) => {
    console.log('would delete movie id', movie.id)
    confirmAlert({
      title: 'Delete Movie?',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const myheaders = new Headers();
            myheaders.append("Content-Type", "application/json");
            myheaders.append("Authorization", "Bearer " + jwt);
            fetch(`${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/` + movie.id, { method: "GET", headers: myheaders })
              .then(response => response.json)
              .then((result) => {
                if (result.error) {
                  setalertInfo({ type: "alert-danger", message: result.error.message })
                } else {
                  navigate('/admin')
                }
              })
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }

  useEffect(() => {
    if (jwt === "") {
      navigate("/login");
      return;
    }
    if (id > 0) {
      fetchMovies(id);
    } else {
      setMovie(defaultMovie)
      setIsLoaded(true);
    }
    return () => {
      console.log('cleanup')
    }
  }, [id, jwt, navigate])

  if (error) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>
        <Alert alertType={alertInfo.type} alertMessage={alertInfo.message} />
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" id="id" value={movie.id} onChange={handleChange} ></input>
          <Input title={"Title"} type={"text"} name={'title'} value={movie.title}
            handleChange={handleChange}
            className={hasError("title") ? "is-invalid" : ""}
            errorDiv={hasError("title") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a title"} />
          <Input title={"Release date"} type={"date"} name={'release_date'} value={movie.release_date} handleChange={handleChange} placeholder={'yyyy-mm-dd'} />
          <Input title={"runtime"} type={"text"} name={'runtime'} value={movie.runtime} handleChange={handleChange} />
          <Select title={"MPAA rating"} name={"mpaa_rating"} value={movie.mpaa_rating} handleChange={handleChange} options={MPAARating} placeholder={"Choose mpaa rating"} />
          <Input title={"Rating"} type={"text"} name={'rating'} value={movie.rating} handleChange={handleChange} />
          <TextInput title={"Description"} rows={3} name={'description'} value={movie.description} handleChange={handleChange} />
          <hr></hr>
          <button className="btn btn-primary">Save</button>
          <Link to="/admin" className="btn btn-warning ms-2">Cancel</Link>
          {movie.id > 0 && (
            <a href="#!" onClick={() => confirmDelete()} className="btn btn-danger ms-1">Delete</a>
          )}
        </form>
        <div className="mt-3">
          <pre>{JSON.stringify(movie, null, 2)}</pre>
        </div>
      </Fragment >
    )
  }
}