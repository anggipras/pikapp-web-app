import React from "react";
import ReactDOM from "react-dom";
import App from './App'
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux"
import store from './Redux/Store'

var hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
