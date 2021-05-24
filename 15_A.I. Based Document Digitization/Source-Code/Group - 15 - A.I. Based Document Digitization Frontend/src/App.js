import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import jwt_decode from "jwt-decode";
import store from "./store";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/reusable/PrivateRoute";
import Docs from './components/pages/Docs'
import Doc from './components/pages/Doc'
import Login from "./components/pages/Login";
import Upload from "./components/pages/Upload";
import Annotate from "./components/pages/Annotate";
import Contributions from "./components/pages/Contributions";
import Contribution from "./components/pages/Contribution";
import Overview from "./components/pages/Overview";
import Register from "./components/pages/Register";
// import Settings from "./components/pages/Settings";
function App() {
  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = "/";
    }
  }

  return (
    <Router>
      <div className='App'>
        <Route exact path='/' component={Login} />
        <Route exact path='/register' component={Register} />
        <Switch>
          <PrivateRoute exact path='/dashboard' component={Docs} />
          <PrivateRoute exact path='/fetch/:id' component={Doc} />
          <PrivateRoute exact path='/upload' component={Upload} />
          <PrivateRoute exact path='/annotate' component={Annotate} />
          <PrivateRoute exact path='/contributions' component={Contributions} />
          <PrivateRoute exact path='/contribution/:id' component={Contribution} />
          <PrivateRoute exact path='/overview' component={Overview} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
