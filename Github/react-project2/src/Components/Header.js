import React, { useEffect } from "react";
import { Divider } from "@material-ui/core";
import { Route, Switch, Redirect } from "react-router-dom";
import { Profile, Feeds } from "../Container";
import { Button, Upload } from ".";
import logo1 from "../../src/Images/logo1.png";
import decode from "jwt-decode";

const Header = (props) => {
  useEffect(() => {
    if (!localStorage.getItem("tokens")) {
      props.history.push("/signin");
    }
  }, []);

  return (
    <div className="rootClass">
      <div className="navbar">
        <img className="logo1" src={logo1} alt="img" />
        <div className="navMenu">
          <span className="myUpload">
            <Upload />
          </span>
          <label className="navButtons">
            <Button
              className={
                props.location &&
                props.location.pathname ===
                  `/profile/${
                    localStorage.getItem("tokens") &&
                    decode(localStorage.getItem("tokens")).id
                  }`
                  ? "underline navBtn"
                  : "navBtn"
              }
              onClick={(e) =>
                props.history.push(
                  `/profile/${
                    localStorage.getItem("tokens") &&
                    decode(localStorage.getItem("tokens")).id
                  }`
                )
              }
              text="Profile"
            />
            <Button
              className={
                props.location &&
                props.location.pathname !==
                  `/profile/${
                    localStorage.getItem("tokens") &&
                    decode(localStorage.getItem("tokens")).id
                  }`
                  ? "underline navBtn"
                  : "navBtn"
              }
              onClick={(e) => props.history.push("/feeds")}
              text="Feeds"
            />
          </label>
        </div>
      </div>
      <Divider />
      <div className="container4">
        <Switch>
          <Route exact path="/profile/:user" component={Profile} />
          <Route exact path="/feeds" component={Feeds} />
          <Redirect to="/feeds" />
        </Switch>
      </div>
    </div>
  );
};

export default Header;
