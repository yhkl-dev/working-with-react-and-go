import React, { useState, Fragment, } from 'react'
import { useNavigate } from 'react-router'
import { Input } from './form-components/input'
import { Alert } from './ui-component/Alert'

const defaultData = {
  email: "",
  password: "",
  error: null,
}

const defaultAlert = {
  type: "d-done",
  message: ""
}

export default function Login({ handleJWTChange }) {
  const [data, setData] = useState(defaultData)
  const [errorInfo, seterrorInfo] = useState([])
  const [alert, setalert] = useState(defaultAlert)
  const navigate = useNavigate();

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setData(
      (prevState) => ({
        ...prevState,
        [name]: value
      })
    )
  }
  const handleSubmit = (event) => {
    event.preventDefault();

    let errors = [];
    if (data.email === "") {
      errors.push("email");
    }
    if (data.password === "") {
      errors.push("password");
    }
    seterrorInfo(errors)

    if (errorInfo.length > 0) {
      return false;
    }
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload)
    }
    signin(requestOptions)
  }

  async function signin(requestOptions) {
    const response = await fetch("http://localhost:4000/v1/signin", requestOptions);
    const result = await response.json(response);
    if (result.error) {
      setalert({ type: "alert-danger", message: result.error.message });
    } else {
      console.log(result);
      // setalert({ type: "alert-success", message: "Login success" });
      handleJWTChange(Object.values(result)[0]);
      window.localStorage.setItem("jwt", JSON.stringify(Object.values(result)[0]));
      navigate("/admin")
    }
  }

  function hasError(key) {
    return errorInfo.indexOf(key) !== -1;
  }

  return (
    <Fragment>
      <h2>Login</h2>
      <hr />
      <Alert alertType={alert.type} alertMessage={alert.message} />
      <form className="pt-3" onSubmit={handleSubmit}>
        <Input title={"Email"} type={"email"} name={"email"}
          handleChange={handleChange}
          className={hasError("email") ? "is-invalid" : ""}
          errorDiv={hasError("email") ? "text-danger" : "d-none"}
          errorMsg={"Please enter a valid email address"}
        />
        <Input title={"Password"} type={"password"} name={"password"}
          handleChange={handleChange}
          className={hasError("password") ? "is-invalid" : ""}
          errorDiv={hasError("password") ? "text-danger" : "d-none"}
          errorMsg={"Please enter a password"}
        />
        <hr></hr>
        <button className="btn btn-primary">Login</button>
      </form>
    </Fragment>
  )
}