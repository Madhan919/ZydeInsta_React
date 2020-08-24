import React, { useEffect } from "react";
import { Divider } from "@material-ui/core";
import { Route, Switch, Redirect } from "react-router-dom";
import { Profile, Feeds } from "../Container";
import { Button, Upload } from ".";

const Header = (props) => {
  useEffect(() => {
    if (!localStorage.getItem("tokens")) {
      props.history.push("/signin");
    }
  });

  return (
    <div className="rootClass">
      <div className="navbar">
        <img className="logo1" src="Image/logo1.png" alt="img" />
        <span className="myUpload">
          <Upload />
        </span>
        <label className="navButtons">
          <Button
            className={
              props.location.pathname === "/post"
                ? "underline navBtn"
                : "navBtn"
            }
            onClick={(e) => props.history.push("/post")}
            text="Profile"
          />
          <Button
            className={
              props.location.pathname !== "/post"
                ? "underline navBtn"
                : "navBtn"
            }
            onClick={(e) => props.history.push("/feeds")}
            text="Feeds"
          />
        </label>
      </div>
      <Divider />
      <div className="feed-root">
        <div className="container4">
          <div className="innerDiv">
            <Switch>
              <Route exact path="/post" component={Profile} />
              <Route exact path="/feeds" component={Feeds} />
              <Redirect to="/feeds" />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
