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

export var auth = {
  isLogged: false,
  validTime: "",
  token: "",
  email: "",
  new_event: true,
  recommendation_status: false,
};

export var cart = [
  { 
    mid: "",
    storeName: "",
    storeDesc: "",
    storeDistance: "",
    food: [
      {
        productId: "",
        foodName: "",
        foodPrice: 0,
        foodAmount: 0,
        foodImage: "",
        foodNote: "",
      },
    ],
  },
];

export var currentMerchant = {
  mid: "",
  storeName: "",
  storeImage: "",
  storeDesc: "",
  storeDistance: "",
};

// if (localStorage.getItem("auth")) {
//   auth = localStorage.getItem("auth");
// }
// if (localStorage.getItem("cart")) {
//   cart = JSON.parse(localStorage.getItem("cart"));
// }
// if (localStorage.getItem("currentMerchant")) {
//   currentMerchant = JSON.parse(localStorage.getItem("currentMerchant"));
// }

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
