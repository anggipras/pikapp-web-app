import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Asset/scss/App.scss";
import AuthLayout from "./Master/AuthLayout";
import ProductLayout from "./Master/ProductLayout";
import CartLayout from "./Master/CartLayout";
import StatusLayout from "./Master/StatusLayout";
import StoreLayout from "./Master/StoreLayout";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

var hist = createBrowserHistory();
export var isLoggedIn = false;
export var cart = [
  {
    storeName: "",
    storeDesc: "",
    food: [
      {
        foodName: "",
        foodPrice: 0,
        foodAmount: 0,
      },
    ],
  },
];

if (localStorage.getItem("authStatus")) {
  isLoggedIn = localStorage.getItem("authStatus");
}
if (localStorage.getItem("cart")) {
  console.log(localStorage.getItem("cart"));
  cart = JSON.parse(localStorage.getItem("cart"));
}
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/login" component={() => <AuthLayout isLogin={true} />} />
      <Route
        path="/register"
        component={() => <AuthLayout isLogin={false} />}
      />
      <Route path="/cart" component={() => <CartLayout />} />
      <Route path="/status" component={() => <StatusLayout />} />
      <Route path="/store" component={() => <ProductLayout />} />
      <Route path="/" component={() => <StoreLayout />} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
