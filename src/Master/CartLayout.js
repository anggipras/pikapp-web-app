import React from "react";
import CartView from "../View/Cart/CartView";
import Cookies from "js-cookie"

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

    let getMatchPromoCaseCookies
    let matchPromoCaseValue
    if (Cookies.get("NOTMATCHPROMO")) {
      getMatchPromoCaseCookies = JSON.parse(Cookies.get("NOTMATCHPROMO"))
      matchPromoCaseValue = getMatchPromoCaseCookies.theBool
    }

    return (
      <CartView noTable={valueTable} paymentType={paymentType} paymentOption={paymentOption} indexOptionPay={indexOptionPay} phoneNum={phone_number} selectedPromo={getSelectedPromo} notMatchPromo={matchPromoCaseValue} />
    );
  }
}
