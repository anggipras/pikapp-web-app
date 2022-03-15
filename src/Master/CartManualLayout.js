import React from "react";
import CartManualView from "../View/Cart/CartManualView";
import { connect } from "react-redux";
import { 
  ReMapPickupType, 
  ReMapPaymentType, 
  OvoPhoneNumber, 
  ShippingDateType, 
  ShippingDate, 
  CustomerName, 
  CustomerPhoneNumber,
  ShipmentTypeDelivery,
  ShipmentNotesDelivery,
  FormattedAddress,
  District,
  City,
  ShipmentWithCourier ,
  FullAddress,
  Lat,
  Lng,
  PostalCode,
  Province
} from '../Redux/Actions'
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
    if (Cookies.get("MANUAL_NOTMATCHPROMO")) {
      getMatchPromoCaseCookies = JSON.parse(Cookies.get("MANUAL_NOTMATCHPROMO"))
      matchPromoCaseValue = getMatchPromoCaseCookies.theBool
    }

    let customerName
    if (Cookies.get("MANUAL_CUSTOMER_NAME")) {
      let getCustomerNameCookies = JSON.parse(Cookies.get("MANUAL_CUSTOMER_NAME"))
      customerName = getCustomerNameCookies.custName
      this.props.CustomerName(customerName);
    }

    let customerPhoneNumber
    if (Cookies.get("MANUAL_CUSTOMER_PHONENUM")) {
      let getCustomerPhoneNumberCookies = JSON.parse(Cookies.get("MANUAL_CUSTOMER_PHONENUM"))
      customerPhoneNumber = getCustomerPhoneNumberCookies.phoneNum
      this.props.CustomerPhoneNumber(customerPhoneNumber);
    }

    let shipmentDateType
    if (Cookies.get("SHIPMENTDATETYPE")) {
      let getShipmentDateTypeCookies = JSON.parse(Cookies.get("SHIPMENTDATETYPE"))
      shipmentDateType = getShipmentDateTypeCookies.shipmentDateType
      this.props.ShippingDateType(shipmentDateType)
    }

    let shipmentDate
    if (Cookies.get("SHIPMENTDATE")) {
      let getShipmentDateCookies = JSON.parse(Cookies.get("SHIPMENTDATE"))
      shipmentDate = getShipmentDateCookies.shipmentDate
      this.props.ShippingDate(shipmentDate)
    }

    // Delivery Option Selected
    if (JSON.parse(localStorage.getItem("SHIPPINGTYPE"))) {
      let shippingType = JSON.parse(localStorage.getItem("SHIPPINGTYPE"))
      this.props.ShipmentTypeDelivery(shippingType)
    }

    if (JSON.parse(localStorage.getItem("SHIPPERNOTES"))) {
      let shippingNotes = JSON.parse(localStorage.getItem("SHIPPERNOTES"))
      this.props.ShipmentNotesDelivery(shippingNotes)
    }

    if (JSON.parse(localStorage.getItem("FORMATTEDADDRESS"))) {
      let formattedAddress = JSON.parse(localStorage.getItem("FORMATTEDADDRESS"))
      this.props.FormattedAddress(formattedAddress)
    }

    if (JSON.parse(localStorage.getItem("FULLADDRESS"))) {
      let fullAddress = JSON.parse(localStorage.getItem("FULLADDRESS"))
      this.props.FullAddress(fullAddress)
    }

    if (JSON.parse(localStorage.getItem("LAT"))) {
      let lat = JSON.parse(localStorage.getItem("LAT"))
      this.props.Lat(lat)
    }

    if (JSON.parse(localStorage.getItem("LNG"))) {
      let lng = JSON.parse(localStorage.getItem("LNG"))
      this.props.Lng(lng)
    }

    if (JSON.parse(localStorage.getItem("POSTALCODE"))) {
      let postalCode = JSON.parse(localStorage.getItem("POSTALCODE"))
      this.props.PostalCode(postalCode)
    }

    if (JSON.parse(localStorage.getItem("DISTRICT"))) {
      let district = JSON.parse(localStorage.getItem("DISTRICT"))
      this.props.District(district)
    }

    if (JSON.parse(localStorage.getItem("CITY"))) {
      let city = JSON.parse(localStorage.getItem("CITY"))
      this.props.City(city)
    }

    if (JSON.parse(localStorage.getItem("PROVINCE"))) {
      let province = JSON.parse(localStorage.getItem("PROVINCE"))
      this.props.Province(province)
    }

    if (JSON.parse(localStorage.getItem("SHIPPING_WITH_COURIER"))) {
      let shipmentWithCourier = JSON.parse(localStorage.getItem("SHIPPING_WITH_COURIER"))
      this.props.ShipmentWithCourier(
        shipmentWithCourier.shippingName,
        shipmentWithCourier.shippingPrice,
        shipmentWithCourier.shippingDesc,
        shipmentWithCourier.courierServiceType,
        shipmentWithCourier.shippingCode,
        shipmentWithCourier.insuranceCheckbox,
        shipmentWithCourier.insurancePrice,
        )
    }

    return (
      <CartManualView selectedPromo={getSelectedPromo} notMatchPromo={matchPromoCaseValue} />
    );
  }
}

export default connect(null, { 
  ReMapPickupType, 
  ReMapPaymentType, 
  OvoPhoneNumber, 
  ShippingDateType, 
  ShippingDate, 
  CustomerName, 
  CustomerPhoneNumber,
  ShipmentTypeDelivery,
  ShipmentNotesDelivery,
  FormattedAddress,
  District,
  City,
  ShipmentWithCourier,
  FullAddress,
  Lat,
  Lng,
  PostalCode,
  Province
})(CartManualLayout)