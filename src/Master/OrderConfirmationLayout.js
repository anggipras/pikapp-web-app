import React from "react";
import OrderConfirmationView from "../View/OrderConfirmation/OrderConfirmationView";

export default class OrderConfirmationLayout extends React.Component {
    componentDidMount() {
      document.body.style.backgroundColor = 'white';
    }
  
    render() {
      return (
        <OrderConfirmationView />
      );
    }
  }