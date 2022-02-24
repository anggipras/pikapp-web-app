import React from "react";
import CartManualView from "../View/Cart/CartManualView";
import { connect } from "react-redux";
import { ReMapPickupType, ReMapPaymentType, OvoPhoneNumber } from '../Redux/Actions'
import Cookies from "js-cookie";

class CartManualLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    let shipmentType
    let indexShipment
    if (JSON.parse(localStorage.getItem("SHIPMENT_TYPE"))) {
      let shipmentTypeCookies = JSON.parse(localStorage.getItem("SHIPMENT_TYPE"))
      shipmentType = shipmentTypeCookies.shipmentType
      indexShipment = shipmentTypeCookies.indexShipment
      this.props.ReMapPickupType(indexShipment, shipmentType)
    }

    let paymentType
    let indexPayment
    if (JSON.parse(localStorage.getItem("MANUAL_PAYMENT_TYPE"))) {
      let paymentTypeCookies = JSON.parse(localStorage.getItem("MANUAL_PAYMENT_TYPE"))
      paymentType = paymentTypeCookies.paymentType
      indexPayment = paymentTypeCookies.indexPayment
      this.props.ReMapPaymentType(indexPayment, paymentType)
    }

    if (JSON.parse(localStorage.getItem("MANUAL_PHONE_NUMBER"))) {
      let phoneNumCookies = JSON.parse(localStorage.getItem("MANUAL_PHONE_NUMBER"))
      this.props.OvoPhoneNumber(phoneNumCookies.phoneNumber)
    }

    let getSelectedPromo
    if (JSON.parse(localStorage.getItem("MANUAL_SELECTED_PROMO"))) {
      getSelectedPromo = JSON.parse(localStorage.getItem("MANUAL_SELECTED_PROMO"))
    }

    let getMatchPromoCaseCookies
    let matchPromoCaseValue
    if (Cookies.get("NOTMATCHPROMO")) {
      getMatchPromoCaseCookies = JSON.parse(Cookies.get("NOTMATCHPROMO"))
      matchPromoCaseValue = getMatchPromoCaseCookies.theBool
    }

    return (
      <CartManualView selectedPromo={getSelectedPromo} notMatchPromo={matchPromoCaseValue} />
    );
  }
}

export default connect(null, { ReMapPickupType, ReMapPaymentType, OvoPhoneNumber })(CartManualLayout)