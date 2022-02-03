import React from "react";
import OrderDetailManualView from "../View/OrderDetail/OrderDetailManualView";

export default class OrderDetailManualLayout extends React.Component {
    componentDidMount() {
      document.body.style.backgroundColor = 'white';
    }
  
    render() {
      return (
        <OrderDetailManualView />
      );
    }
}