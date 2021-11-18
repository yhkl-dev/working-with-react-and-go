import React, { useEffect, Fragment, useState } from 'react'
import { Input, TextInput } from './form-components/input'
import { Select } from './form-components/select'
import "./EditMovie.css"
import { useParams } from 'react-router'

export default function EditMovie() {
  const { id } = useParams();
  console.log(id)
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
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());
    console.log(payload);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload)
    }
    editMovie(requestOptions);
  }

  async function editMovie(requestOptions) {
    const response = await fetch("http://localhost:4000/v1/admin/editmovie", requestOptions)
    if (response.status !== 201) {
      let err = Error;
      err.message = "Invalid response code: " + response.status;
      setData({ error: err });
      return
    }
    const result = await response.json(response);
    console.log(result);
  }

  async function fetchMovies(id) {
    const response = await fetch("http://localhost:4000/v1/movie/" + id);
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
    });
  }

  useEffect(() => {
    if (id > 0) {
      fetchMovies(id);
    } else {
      console.log('id', id)
      setData({ isLoaded: true, movie: defaultData.movie })
    }
    return () => {
      console.log('cleanup')
    }
  }, [id])

  if (data.error) {
    return <div>Error: {data.error.message}</div>
  } else if (!data.isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" id="id" value={data.movie.id} onChange={handleChange} ></input>
          <Input title={"Title"} type={"text"} name={'title'} value={data.movie.title} handleChange={handleChange} />
          <Input title={"Release date"} type={"date"} name={'release_date'} value={data.movie.release_date} handleChange={handleChange} placeholder={'yyyy-mm-dd'} />
          <Input title={"runtime"} type={"text"} name={'runtime'} value={data.movie.runtime} handleChange={handleChange} />
          <Select title={"MPAA rating"} name={"mpaa_rating"} value={data.movie.mpaa_rating} handleChange={handleChange} options={MPAARating} placeholder={"Choose mpaa rating"} />
          <Input title={"Rating"} type={"text"} name={'rating'} value={data.movie.rating} handleChange={handleChange} />
          <TextInput title={"Description"} rows={3} name={'description'} value={data.movie.description} handleChange={handleChange} />
          <hr></hr>
          <button className="btn btn-primary">Save</button>
        </form>
        <div className="mt-3">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </Fragment >
    )
  }
}