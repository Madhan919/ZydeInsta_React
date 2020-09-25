import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { AiOutlineRight } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "../../Components";
import { baseURL } from "..";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "25ch",
    },
  },
}));

const Signin = (props) => {
  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    newpassword: "",
  };
  const regPassword = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
  const regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const classes = useStyles();
  const [state, setState] = useState(initialValues);
  const [isValidate, setValidate] = useState(false);
  const [showPassword, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUnique, setUnique] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const goLogin = (login) => {
    setValidate(false);
    setShow(false);
    setState({ ...state, newpassword: "", password: "" });
    if (login === "signin") {
      setUnique(null);
    } else if (login === "signup") {
      setUnique(false);
      setState({ ...state, newpassword: "", password: "" });
    }
  };
  const checkEmail = (event) => {
    event.preventDefault();
    if (regEmail.test(state.email)) {
      setSpinner(true);
      axios
        .get(`${baseURL.axios.baseURL}/check-email`, {
          headers: {
            email: state.email,
          },
        })
        .then((response) => {
          console.log(response.data.response);
          setValidate(false);
          setErrorMessage("");
          setSpinner(false);
          if (!response.data.response) {
            setUnique(false);
          } else {
            setUnique(true);
          }
        })
        .catch((error) => {
          console.log(error.response);
          setValidate(true);
          setErrorMessage({ status: 422, msg: error.response.data.message });
        });
    } else {
      setValidate(true);
    }
  };

  const goSignup = (event) => {
    event.preventDefault();
    if (
      !regEmail.test(state.email) ||
      !state.firstName ||
      !state.lastName ||
      !regPassword.test(state.newpassword)
    ) {
      setValidate(true);
    } else {
      setUnique(false);
      const userData = {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.newpassword,
        loginType: "custom",
      };
      setSpinner(true);
      axios
        .post(`${baseURL.axios.baseURL}/signup`, userData)
        .then((response) => {
          console.log("Data", response);
          if (response.data.token) {
            localStorage.setItem("tokens", response.data.token);
            props.history.push("/feeds");
            setSpinner(false);
          }
        })
        .catch((error) => {
          setValidate(true);
          setUnique(false);
          setErrorMessage({
            msg: error.response.data.message,
            status: error.response.data.status,
          });
          console.log("Error", error.response);
          setSpinner(false);
        });
    }
  };

  const goSignin = (event) => {
    event.preventDefault();
    if (!regEmail.test(state.email) || !regPassword.test(state.newpassword)) {
      setValidate(true);
      setSpinner(true);
      if (isUnique === true) {
        axios
          .get(`${baseURL.axios.baseURL}/signin`, {
            headers: {
              email: state.email,
              password: state.password,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.token) {
              setErrorMessage("");
              setValidate(false);
              setSpinner(false);
              localStorage.setItem("tokens", res.data.token);
              props.history.push("/feeds");
            }
          })
          .catch((error) => {
            setSpinner(true);
            setValidate(true);
            setErrorMessage({
              msg: error.response.data.message,
              status: error.response.data.status,
            });
            console.log(error.response);
            setSpinner(false);
          });
      } else {
        setUnique(false);
      }
    }
  };
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div className={isUnique === false ? "container1" : "container1-2"}>
        <img className="logo" src="Image/logo1.png" alt="img" />
        <header className="header2">
          {isUnique === false ? "Sign Up" : "Sign In"} <br />
          <span className="headerTxt">to continue to Gmail</span>
        </header>
        <TextField
          name="email"
          id={isUnique === null ? "outlined-basic11" : "outlined-basic1"}
          label="Email"
          variant="outlined"
          onChange={(event) =>
            setState(
              { ...state, email: event.target.value.trim() },
              setValidate(false)
            )
          }
          value={state.email}
          error={
            (isValidate && !regEmail.test(state.email) && true) ||
            (isValidate &&
              (errorMessage.status === 409 || errorMessage.status === 422) &&
              true)
          }
          helperText={
            (isValidate &&
              !regEmail.test(state.email) &&
              "Please Enter valid email") ||
            (isValidate &&
              (errorMessage.status === 409 || errorMessage.status === 422) &&
              errorMessage.msg)
          }
          disabled={isUnique === true && true}
          fullWidth={true}
        />

        {isUnique === null &&
          (spinner ? (
            <div
              style={{
                position: "unset",
                float: "right",
                marginTop: "-64px",
                marginRight: "10px",
              }}
              className="spinner-border"
            />
          ) : (
            <button
              className={isValidate ? "angularBtn-1" : "angularBtn"}
              onClick={checkEmail}
            >
              <AiOutlineRight size="1.5rem" />
            </button>
          ))}

        {isUnique === false && (
          <Fragment>
            <TextField
              name="firstName"
              id="outlined-basic2"
              label="First Name"
              variant="outlined"
              error={isValidate && !state.firstName && true}
              helperText={
                isValidate && !state.firstName && "Please Enter First Name"
              }
              value={state.firstName}
              onChange={(event) =>
                setState({ ...state, firstName: event.target.value.trim() })
              }
              fullWidth={true}
              className={isUnique !== null && "text-field"}
            />
            <TextField
              name="lastName"
              id="outlined-basic3"
              label="Last Name"
              variant="outlined"
              value={state.lastName}
              error={isValidate && !state.lastName && true}
              helperText={
                isValidate && !state.lastName && "Please Enter Last Name"
              }
              onChange={(event) =>
                setState({ ...state, lastName: event.target.value.trim() })
              }
              fullWidth={true}
            />
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TextField
                name="newpassword"
                type={showPassword ? "text" : "password"}
                id="outlined-basic4"
                label="Password"
                variant="outlined"
                value={state.newpassword}
                error={
                  isValidate && !regPassword.test(state.newpassword) && true
                }
                helperText={
                  isValidate &&
                  !regPassword.test(state.newpassword) &&
                  "Please Enter Password"
                }
                onChange={(event) =>
                  setState({ ...state, newpassword: event.target.value.trim() })
                }
                fullWidth={true}
              />
              {state.newpassword && isUnique === false && (
                <Button
                  type="button"
                  className={isValidate ? "showPassword-1" : "showPassword"}
                  onClick={() =>
                    showPassword ? setShow(false) : setShow(true)
                  }
                  text={showPassword ? "Hide" : "Show"}
                />
              )}
            </div>
          </Fragment>
        )}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          {isUnique === true && (
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              id="outlined-basic5"
              label="Password"
              variant="outlined"
              value={state.password}
              error={
                (isValidate && state.email && !state.password && true) ||
                (isValidate &&
                  state.email &&
                  errorMessage.status === 403 &&
                  true)
              }
              helperText={
                (isValidate &&
                  state.email &&
                  !state.password &&
                  "Please Enter Password") ||
                (isValidate &&
                  state.email &&
                  errorMessage.status === 403 &&
                  errorMessage.msg)
              }
              onChange={(event) =>
                setState(
                  { ...state, password: event.target.value.trim() },
                  setValidate(false),
                  setErrorMessage("")
                )
              }
              fullWidth={true}
              disabled={spinner && true}
            />
          )}
          {state.password && isUnique === true && (
            <Button
              type="button"
              className={isValidate ? "showPassword-1" : "showPassword"}
              onClick={() => (showPassword ? setShow(false) : setShow(true))}
              text={showPassword ? "Hide" : "Show"}
            />
          )}
        </div>

        {isUnique !== null && (
          <Button
            className="submit"
            onClick={isUnique === false ? goSignup : goSignin}
            text={!spinner && "Next"}
            // style={
            //   (isUnique === true && state.password.length < 5) || spinner
            //     ? { opacity: "0.5" }
            //     : { opacity: "1" }
            // }
            loader={
              spinner && (
                <div
                  style={{ color: "#fff", position: "unset" }}
                  className="spinner-border"
                />
              )
            }
          />
        )}
        {isUnique === true && (
          <Button
            type="button"
            className="link-a"
            text="Forget Password?"
            style={{ float: "right" }}
          />
        )}
        {isUnique && state.email && (
          <Fragment>
            <Button
              type="button"
              className="linkBtn"
              onClick={() =>
                isUnique === false ? goLogin("signin") : goLogin("signup")
              }
              text={isUnique === false ? "Sign In" : "Go to Signup"}
            />
          </Fragment>
        )}

        {isUnique !== true && (
          <Fragment>
            <p
              className="center"
              style={{
                fontSize: "15px",
                color: "gray",
                margin: 0,
              }}
            >
              {isUnique === false ? "Have an account?" : "Go to social login?"}
              <Button
                type="button"
                className="linkBtn"
                onClick={() =>
                  isUnique === false
                    ? goLogin("signin")
                    : props.history.push("/")
                }
                text={isUnique === false ? "Signin" : "Signup"}
              />
            </p>
            {isUnique === null && (
              <p style={{ margin: "0px", paddingTop: "15px" }}>
                Not your computer? Use Guest mode to sign in privately.
                <Button className="links" text="Learn more" />
              </p>
            )}
          </Fragment>
        )}
        <div className="sweet-loading"></div>
      </div>
    </form>
  );
};
export default Signin;
