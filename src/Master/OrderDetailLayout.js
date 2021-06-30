import React from "react";
import OrderDetailView from "../View/OrderDetail/OrderDetailView";

export default class OrderDetailLayout extends React.Component {
    componentDidMount() {
      document.body.style.backgroundColor = 'white';
    }
  
    render() {
      return (
        <OrderDetailView />
      );
    }
  }