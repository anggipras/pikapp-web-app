import React, { useEffect, useState } from "react";
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
import FoodCourt from "./Master/FoodCourtQR";
import ResetPin from "./View/ResetPin/ResetPinView";
import OrderConfirmationLayout from "./Master/OrderConfirmationLayout";
import OrderDetailLayout from "./Master/OrderDetailLayout";
import OrderDetailManualLayout  from "./Master/OrderDetailManualLayout";
import ManualTxn from "./Master/ManualTransaction";
import CartManualLayout from "./Master/CartManualLayout";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux'
import PickupSelectionView from "./View/Cart/AddressSelection/PickupSelectionView";
import AddressInputView from "./View/Cart/AddressSelection/AddressInputView";
import AddressMapsView from "./View/Cart/AddressSelection/AddressMapsView";
import AddressSearchView from "./View/Cart/AddressSelection/AddressSearchView";
import ShippingTypeView from "./View/Cart/ShippingSelection/ShippingTypeView";
import ShippingDetailView from "./View/Cart/ShippingSelection/ShippingDetailView";
import ShippingDateView from "./View/Cart/ShippingDate/ShippingDateView";
import PaymentMethodView from "./View/Cart/PaymentSelection/PaymentMethodView";
import StatusCartManualLayout from "./Master/StatusCartManualLayout";
import TrackingDeliveryLayout from "./Master/TrackingDeliveryLayout";
import PromoView from "./View/Promo/PromoView";
import MerchantDetailProfile from "./View/Product/MerchantDetailProfile";
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

export var counterTime = 0;
export var timeLeft = null;

if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
} else {
    localStorage.setItem('cart', JSON.stringify(cart))
}

if (!localStorage.getItem("storeTour")) {
    localStorage.setItem('storeTour', 1);
    localStorage.setItem('productTour', 1);
    localStorage.setItem('cartTour', 1);
    localStorage.setItem('merchantFlow', 1);
    localStorage.setItem('cartMerchant', 1);
}

function countDown(){
    let counter = Number(localStorage.getItem("counterPayment"));
    if(counter == 0) {
        clearInterval(timeLeft);
        console.log("clear");
        localStorage.setItem("counterPayment", counterTime);
    } else {
        counterTime = counter - 1;
        localStorage.setItem("counterPayment", counterTime);
    }
}


function App() {
    const dispatch = useDispatch();
    const [tokenFound, setTokenFound] = useState('');

    dispatch({ type: 'FCMTOKEN', payload: tokenFound });

    if(localStorage.getItem("counterPayment")) {
        timeLeft = setInterval(() => countDown(), 1000);
    }

    return (
        <Switch>
            <Route path="/login" component={() => <AuthLayout isLogin={true} />} />
            <Route
                path="/register"
                component={() => <AuthLayout isLogin={false} />}
            />
            <Route path="/cart" component={() => <CartLayout />} />
            <Route path="/status" component={() => <StatusLayout />} />
            <Route path="/statuscartmanual" component={() => <StatusCartManualLayout />} />
            <Route path="/store" component={() => <ProductLayout />} />
            <Route exact path="/merchant-profile" component={MerchantDetailProfile} />
            <Route exact path="/merchant/:mid/:notab" component={MerchantResto} />
            <Route exact path="/merchant/list/:address/:notab" component={FoodCourt} />
            <Route exact path="/promo" component={PromoView} />
            <Route path="/profile" component={() => <ProfileLayout />} />
            <Route path="/reset-pin/:pintoken" component={ResetPin} />
            <Route path="/orderconfirmation" component={() => <OrderConfirmationLayout />} />
            <Route path="/orderdetail" component={() => <OrderDetailLayout />} />
            <Route path="/orderdetaildelivery" component={() => <OrderDetailManualLayout />} />
            <Route exact path="/cartmanual/pickup/address" component={AddressInputView} />
            <Route exact path="/cartmanual/pickup/location" component={AddressMapsView} />
            <Route exact path="/cartmanual/pickup/search" component={AddressSearchView} />
            <Route exact path="/cartmanual/pickup/shipping" component={ShippingTypeView} />
            <Route exact path="/cartmanual/pickup/detail" component={ShippingDetailView} />
            <Route path="/cartmanual/pickup" component={PickupSelectionView} />
            <Route path="/cartmanual/shipping" component={ShippingDateView} />
            <Route path="/cartmanual/payment" component={PaymentMethodView} />
            <Route path="/cartmanual" component={() => <CartManualLayout />} />
            <Route path="/tracking" component={() => <TrackingDeliveryLayout />} />
            <Route exact path="/:username" component={(props) => <ProductLayout {...props}/>} />
            <Route path="/" component={() => <StoreLayout />} />
        </Switch>
    )
}

export default App
