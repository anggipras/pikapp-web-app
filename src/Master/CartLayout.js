import React from "react";
import CartView from "../View/Cart/CartView";

export default class CartLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    let valueTable
    if (localStorage.getItem('table')) {
      valueTable = localStorage.getItem('table')
    }

    let phone_number
    if (localStorage.getItem('PHONE_NUMBER')) {
      phone_number = JSON.parse(localStorage.getItem('PHONE_NUMBER'))
    }

    let paymentTypeCookies
    let paymentType
    let paymentOption
    let indexOptionPay
    if (JSON.parse(localStorage.getItem("PAYMENT_TYPE"))) {
      paymentTypeCookies = JSON.parse(localStorage.getItem("PAYMENT_TYPE"))
      paymentType = paymentTypeCookies.paymentType
      paymentOption = paymentTypeCookies.paymentOption
      indexOptionPay = paymentTypeCookies.indexOptionPay
    }

    let getSelectedPromo
    if (JSON.parse(localStorage.getItem("SELECTED_PROMO"))) {
      getSelectedPromo = JSON.parse(localStorage.getItem("SELECTED_PROMO"))
    }

    return (
      <CartView noTable={valueTable} paymentType={paymentType} paymentOption={paymentOption} indexOptionPay={indexOptionPay} phoneNum={phone_number} selectedPromo={getSelectedPromo} />
    );
  }
}
