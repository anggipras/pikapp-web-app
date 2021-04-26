import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./Asset/scss/App.scss";
import AuthLayout from "./Master/AuthLayout";
import ProductLayout from "./Master/ProductLayout";
import CartLayout from "./Master/CartLayout";
import StatusLayout from "./Master/StatusLayout";
import StoreLayout from "./Master/StoreLayout";
import ProfileLayout from "./Master/ProfileLayout";
import MerchantResto from "./Master/MerchantQR";
import ResetPin from "./View/ResetPin/ResetPinView";
import { Route, Switch } from "react-router-dom";

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
} else {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function App() {
    return (
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
            <Route path="/reset-pin/:pintoken" component={ResetPin} />
            <Route path="/" component={() => <StoreLayout />} />
        </Switch>
    )
}

export default App