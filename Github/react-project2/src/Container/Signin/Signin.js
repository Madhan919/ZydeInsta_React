import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { AiOutlineRight } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "../../Components";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
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
  const [errorMessage, setErrorMessage] = useState();
  const [isUnique, setUnique] = useState(null);
  const goLogin = (login) => {
    if (login === "signin") {
      setValidate(false);
      setUnique(true);
    } else if (login === "signup") {
      setValidate(false);
      setUnique(false);
    }
  };
  const checkEmail = (event) => {
    event.preventDefault();
    console.log("check", errorMessage);
    if (regEmail.test(state.email)) {
      axios
        .get("http://localhost:9000/check-email", {
          headers: {
            email: state.email,
          },
        })
        .then((response) => {
          if (response.data.message) {
            if (response.data.message.loginType !== "custom") {
              setErrorMessage(response.data.message.loginType);
            } else {
              setValidate(false);
              setUnique(true);
              setErrorMessage("");
            }
          } else {
            setValidate(false);
            setUnique(false);
          }
        })
        .catch((error) => {
          console.log(error.response);
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
      axios
        .post("http://localhost:9000/signup", userData)
        .then((response) => {
          console.log("Data", response);
          if (response.data.token) {
            localStorage.setItem("tokens", response.data.token);
            props.history.push("/feeds");
          }
        })
        .catch((error) => {
          setValidate(true);
          setUnique(false);
          setErrorMessage("Email");
          console.log("Error", error.response);
        });
    }
  };

  const goSignin = (event) => {
    event.preventDefault();
    if (!regEmail.test(state.email) || !regPassword.test(state.newpassword)) {
      setValidate(true);
      if (isUnique === true) {
        axios
          .get("http://localhost:9000/signin", {
            headers: {
              email: state.email,
              password: state.password,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.token) {
              setValidate(false);
              localStorage.setItem("tokens", res.data.token);
              props.history.push("/feeds");
            }
          })
          .catch((error) => {
            setValidate(true);
            setErrorMessage("Password");
            console.log(error.response);
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
          id="outlined-basic1"
          label="Email"
          variant="outlined"
          onChange={(event) =>
            setState(
              { ...state, email: event.target.value.trim() },
              setErrorMessage(""),
              setValidate(false)
            )
          }
          error={
            (isValidate && !regEmail.test(state.email) && true) ||
            (isValidate && errorMessage === "Email" && true) ||
            errorMessage === "facebook" ||
            (errorMessage === "google" && true)
          }
          helperText={
            (isValidate &&
              !regEmail.test(state.email) &&
              "Please Enter valid email") ||
            (isValidate &&
              errorMessage === "Email" &&
              "Email Address Exist Already..!") ||
            ((errorMessage === "google" || errorMessage === "facebook") &&
              `This user registered by ${errorMessage} login so use another email address. `)
          }
          disabled={isUnique === true && true}
          fullWidth={true}
        />
        {isUnique === null && (
          <button className="angularBtn" onClick={checkEmail}>
            <AiOutlineRight size="1.5rem" />
          </button>
        )}
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
              onChange={(event) =>
                setState({ ...state, firstName: event.target.value.trim() })
              }
              fullWidth={true}
            />
            <TextField
              name="lastName"
              id="outlined-basic3"
              label="Last Name"
              variant="outlined"
              error={isValidate && !state.lastName && true}
              helperText={
                isValidate && !state.lastName && "Please Enter Last Name"
              }
              onChange={(event) =>
                setState({ ...state, lastName: event.target.value.trim() })
              }
              fullWidth={true}
            />
            <TextField
              name="newpassword"
              type="password"
              id="outlined-basic4"
              label="Password"
              variant="outlined"
              error={isValidate && !regPassword.test(state.newpassword) && true}
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
          </Fragment>
        )}
        {isUnique === true && (
          <TextField
            name="password"
            type={showPassword ? "text" : "password"}
            id="outlined-basic5"
            label="Password"
            variant="outlined"
            error={
              (isValidate && state.email && !state.password && true) ||
              (isValidate && state.email && errorMessage === "Password" && true)
            }
            helperText={
              (isValidate &&
                state.email &&
                !state.password &&
                "Please Enter Password") ||
              (isValidate &&
                errorMessage === "Password" &&
                "Incorrect Password")
            }
            onChange={(event) =>
              setState(
                { ...state, password: event.target.value.trim() },
                setValidate(false)
              )
            }
            fullWidth={true}
          />
        )}
        {state.password && isUnique === true && (
          <Button
            type="button"
            className="showPassword"
            onClick={() => (showPassword ? setShow(false) : setShow(true))}
            text={showPassword ? "Hide" : "Show"}
          />
        )}
        {isUnique !== null && (
          <Button
            className="submit"
            onClick={isUnique === false ? goSignup : goSignin}
            text="Next"
            style={
              isUnique === true && state.password.length < 5
                ? { opacity: "0.5" }
                : { opacity: "1" }
            }
          />
        )}
        {isUnique && state.email && (
          <Fragment>
            <p className="center" style={{ fontSize: "15px", color: "gray" }}>
              Don't have an account?
              <Button
                type="button"
                className="linkBtn"
                onClick={() =>
                  isUnique === false ? goLogin("signin") : goLogin("signup")
                }
                text={isUnique === false ? "Sign In" : "Sign Up"}
              />
            </p>
          </Fragment>
        )}

        {!isUnique && (
          <Fragment>
            <Button
              className="link-a"
              onClick={() => props.history.push("/signin")}
              text="Go to signin"
              style={{ float: "left" }}
            />
            <Button
              className="link-a"
              text="Forget Password?"
              style={{ float: "right" }}
            />
            <p style={{ marginTop: "50px" }}>
              Not your computer? Use Guest mode to sign in privately.
              <Button className="links" text="Learn more" />
            </p>
          </Fragment>
        )}
      </div>
    </form>
  );
};
export default Signin;
