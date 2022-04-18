import React from "react";
import OrderReceiptView from "../View/OrderReceipt/OrderReceiptView";

export default class OrderReceiptLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    return (
      <OrderReceiptView />
    );
  }
}
