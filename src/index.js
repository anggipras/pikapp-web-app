import React from "react";
import ReactDOM from "react-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.css';
import "./Asset/scss/App.scss";
import AuthLayout from "./Master/AuthLayout";
// import ProductLayout from "./Master/ProductLayout";
import ProductLayout from "./Master/ProductLayoutDev";
import CartLayout from "./Master/CartLayout";
import StatusLayout from "./Master/StatusLayout";
import StoreLayout from "./Master/StoreLayout";
import ProfileLayout from "./Master/ProfileLayout";
import MerchantResto from "./Master/MerchantQR";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import {Provider} from "react-redux"
import {createStore, applyMiddleware} from 'redux'
import Thunk from 'redux-thunk'
import Reducers from './Redux/Reducers'

var hist = createBrowserHistory();

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
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
}

document.title = "Pikapp"

ReactDOM.render(
  <Provider store={createStore(Reducers,{},applyMiddleware(Thunk))}>
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
        <Route path="/merchant/:mid/:notab" component={MerchantResto} />
        <Route path="/profile" component={() => <ProfileLayout />} />
        <Route path="/" component={() => <StoreLayout />} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
