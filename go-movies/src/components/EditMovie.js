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

export default function EditMovie({ jwt }) {
  const { id } = useParams();
  const [errorInfo, seterrorInfo] = useState([]);
  const [alertInfo, setalertInfo] = useState(defaultAlert);
  let navigate = useNavigate()
  const defaultData = {
    movie: {
      id: 0,
      title: "",
      release_date: "",
      runtime: "",
      mpaa_rating: "",
      rating: "",
      description: ""
    },
    isLoaded: false,
    error: null,
    alert: {
      type: "d-none",
      message: "",
    }
  }
  const MPAARating = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
  ]
  const [data, setData] = useState(defaultData)

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setData((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value
      },
      isLoaded: true,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      }
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // client side validation
    let errors = [];
    if (data.movie.title === "") {
      errors.push("title");
    }
    seterrorInfo(errors);

    if (errorInfo.length > 0) {
      return false;
    }

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + jwt);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: myHeaders
    }
    editMovie(requestOptions);
  }

  async function editMovie(requestOptions) {
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
      let err = Error;
      err.message = "Invalid response code: " + response.status;
      setData({ error: err });
      return
    }
    const res = await response.json(response);
    const releaseDate = new Date(res.movie.release_date);
    console.log('res', res.movie.mpaa_rating)
    setData({
      movie: {
        id: id,
        title: res.movie.title,
        release_date: releaseDate.toISOString().split("T")[0],
        runtime: res.movie.runtime,
        mpaa_rating: res.movie.mpaa_rating,
        description: res.movie.description,
        rating: res.movie.rating
      },
      isLoaded: true,
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      }
    });
  };

  function hasError(key) {
    return errorInfo.indexOf(key) !== -1;
  }

  const confirmDelete = (e) => {
    console.log('would delete movie id', data.movie.id)
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
            fetch(`${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/` + data.movie.id, { method: "GET", headers: myheaders })
              .then(response => response.json)
              .then((result) => {
                if (result.error) {
                  setalertInfo({ type: "alert-danger", message: result.error.message })
                  // setData({
                  //   movie: data.movie,
                  //   alert: { type: "alert-danger", message: result.error.message }, isLoaded: true,
                  //   error: null,
                  //   errors: [],
                  // })
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
    const defaultData = {
      movie: {
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        rating: "",
        description: ""
      },
      isLoaded: false,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      }
    }
    if (id > 0) {
      fetchMovies(id);
    } else {
      console.log('id', id)
      setData({ isLoaded: true, movie: defaultData.movie, errors: errorInfo, alert: alertInfo })
    }
    return () => {
      console.log('cleanup')
    }
  }, [id, jwt, navigate, alertInfo, errorInfo])

  if (data.error) {
    return <div>Error: {data.error.message}</div>
  } else if (!data.isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>
        <Alert alertType={data.alert.type} alertMessage={data.alert.message} />
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" id="id" value={data.movie.id} onChange={handleChange} ></input>
          <Input title={"Title"} type={"text"} name={'title'} value={data.movie.title}
            handleChange={handleChange}
            className={hasError("title") ? "is-invalid" : ""}
            errorDiv={hasError("title") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a title"} />
          <Input title={"Release date"} type={"date"} name={'release_date'} value={data.movie.release_date} handleChange={handleChange} placeholder={'yyyy-mm-dd'} />
          <Input title={"runtime"} type={"text"} name={'runtime'} value={data.movie.runtime} handleChange={handleChange} />
          <Select title={"MPAA rating"} name={"mpaa_rating"} value={data.movie.mpaa_rating} handleChange={handleChange} options={MPAARating} placeholder={"Choose mpaa rating"} />
          <Input title={"Rating"} type={"text"} name={'rating'} value={data.movie.rating} handleChange={handleChange} />
          <TextInput title={"Description"} rows={3} name={'description'} value={data.movie.description} handleChange={handleChange} />
          <hr></hr>
          <button className="btn btn-primary">Save</button>
          <Link to="/admin" className="btn btn-warning ms-2">Cancel</Link>
          {data.movie.id > 0 && (
            <a href="#!" onClick={() => confirmDelete()} className="btn btn-danger ms-1">Delete</a>
          )}
        </form>
        {/* <div className="mt-3">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div> */}
      </Fragment >
    )
  }
}