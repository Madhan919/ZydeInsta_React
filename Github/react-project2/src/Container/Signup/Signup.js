import React from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { FaFacebookSquare } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Divider } from "@material-ui/core";
import axios from "axios";
import { EmailSignin } from "../../Components";

const Signup = (props) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const responseGoogle = (response) => {
    const accessToken = {
      idToken: response.tokenId,
      loginType: "google",
    };
    axios
      .post("http://localhost:9000/social-login", accessToken)
      .then((result) => {
        if (result.data.token) {
          localStorage.setItem("tokens", result.data.token);
          props.history.replace("/feeds");
        }
      })
      .catch((error) => {
        console.log("error", error.response);
        setErrorMessage({
          type: error.response.data.type,
          msg: error.response.data.message,
        });
      });
  };
  const responseFail = () => {
    props.history.push("/");
  };

  const responseFacebook = (response) => {
    const accessToken = {
      idToken: response.accessToken,
      loginType: "facebook",
    };
    axios
      .post("http://localhost:9000/social-login", accessToken)
      .then((result) => {
        if (result.data.token) {
          localStorage.setItem("tokens", result.data.token);
          props.history.replace("/feeds");
        }
      })
      .catch((error) => {
        setErrorMessage({
          type: error.response.data.type,
          msg: error.response.data.message,
        });
        console.log("error", error.response);
      });
  };

  const goSignin = () => {
    props.history.push("/signin");
  };

  return (
    <div className="container">
      <img className="logo" src="Image/logo1.png" alt="img" />
      <div className="inner-container">
        <p className="signupTxt">
          Sign up to see photos and videos of your friends
        </p>
        <div className="buttonDiv">
          <GoogleLogin
            clientId="357491041131-oqq7nbkg0eqbeh7m8e0qcufu4ucq3fp6.apps.googleusercontent.com"
            buttonText="SIGN IN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseFail}
            cookiePolicy={"single_host_origin"}
            className="google"
            style={{ fontWeight: "bold", textAlign: "center" }}
            icon={true}
          />

          <FacebookLogin
            appId="293536608633790"
            autoLoad={true}
            fields="name,email,picture,first_name,last_name"
            icon={<FaFacebookSquare size="1.5rem" className="facebookImg" />}
            textButton="Sign in with Facebook"
            onClick={responseFacebook}
            callback={responseFacebook}
          />
          <div
            className="center"
            style={{ color: "gray", paddingBottom: "8px" }}
          >
            or
          </div>
          <EmailSignin
            className="gmail"
            onClick={goSignin}
            icon={
              <FiMail size="1.5rem" style={{ verticalAlign: "text-top" }} />
            }
            text="SIGN IN WITH GMAIL"
            textClass="textClass"
          />
        </div>
        <div className="terms">
          By signing up, you agree to our,
          <button className="links">Terms</button>Data
          <button className="links">Policy</button>and
          <button className="links">Cookies Policy.</button>
        </div>
        <Divider />
        <div className="account">
          Don't have an account?
          <button
            className="link"
            onClick={(event) => props.history.push("/signin")}
          >
            go to signup
          </button>
        </div>
      </div>
    </div>
  );
};
export default Signup;
