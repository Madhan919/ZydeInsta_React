import React from "react";
import { Header } from "./Components";
import { Signup, Signin, PrivateRoute, PublicRoute } from "./Container";
import { BrowserRouter as Router, Switch } from "react-router-dom";
// import "dotenv/config";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute exact restricted={true} path="/" component={Signup} />
        <PublicRoute
          exact
          restricted={true}
          path="/signin"
          component={Signin}
        />
        <PrivateRoute path="/" component={Header} />
      </Switch>
    </Router>
  );
}

export default App;
