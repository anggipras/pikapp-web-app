export const LoadingButton = () => {
    return {
        type: 'LOADING'
    }
}

export const DoneLoad = () => {
    return {
        type: 'DONELOAD'
    }
}

export const ValidQty = (num) => {
    return {
        type: 'VALIDATIONQTY',
        payload: num
    }
}

export const OpenSelect = (bool) => {
    return {
        type: 'OPENSELECT',
        payload: bool
    }
}

export const GetCheckbox = (data) => {
    return {
        type: 'CHECKBOXES',
        payload: data
    }
}

export const CountCheckbox = (data) => {
    return {
        type: 'COUNTCHECKBOX',
        payload: data
    }
}

export const GetRadio = (data) => {
    return {
        type: 'RADIOBUTTON',
        payload: data
    }
}

export const EditMenuCart = (bool) => {
    return {
        type: 'EDITCART',
        payload: bool
    }
}

export const IsMerchantQR = (bool) => {
    return {
        type: 'ISMERCHANTQR',
        payload: bool
    }
}

export const DataOrder = (data) => {
    return {
        type: 'DATAORDER',
        payload: data
    }
}

export const DataDetail = (data) => {
    return {
        type: 'DATADETAIL',
        payload: data
    }
}

export const CustomerName = (data) => {
    return {
        type: 'CUSTOMERNAME',
        payload: data
    }
}

export const CustomerPhoneNumber = (data) => {
    return {
        type: 'CUSTOMERPHONENUMBER',
        payload: data
    }
}

export const IsManualTxn = (bool) => {
    return {
        type: 'ISMANUALTXN',
        payload: bool
    }
}

export const MapInstance = (data) => {
    return {
        type: 'MAPINSTANCE',
        payload: data
    }
}

export const MapApi = (data) => {
    return {
        type: 'MAPAPI',
        payload: data
    }
}

export const District = (data) => {
    return {
        type: 'DISTRICT',
        payload: data
    }
}

export const FormattedAddress = (data) => {
    return {
        type: 'FORMATTEDADDRESS',
        payload: data
    }
}

export const Places = (data) => {
    return {
        type: 'PLACES',
        payload: data
    }
}

export const Lat = (data) => {
    return {
        type: 'LAT',
        payload: data
    }
}

export const Lng = (data) => {
    return {
        type: 'LNG',
        payload: data
    }
}

export const Center = (data) => {
    return {
        type: 'CENTER',
        payload: data
    }
}

export const PostalCode = (data) => {
    return {
        type: 'POSTALCODE',
        payload: data
    }
}

export const IsMarkerChange = (bool) => {
    return {
        type: 'ISMARKERCHANGE',
        payload: bool
    }
}

export const SearchInput = (data) => {
    return {
        type: 'SEARCHINPUT',
        payload: data
    }
}

export const DataDetailTxn = (data) => {
    return {
        type: 'DATADETAILTXN',
        payload: data
    }
}

export const StreetNumber = (data) => {
    return {
        type: 'STREETNUMBER',
        payload: data
    }
}

export const FullAddress = (data) => {
    return {
        type: 'FULLADDRESS',
        payload: data
    }
}

export const StreetName = (data) => {
    return {
        type: 'STREETNAME',
        payload: data
    }
}

export const City = (data) => {
    return {
        type: 'CITY',
        payload: data
    }
}

export const Province = (data) => {
    return {
        type: 'PROVINCE',
        payload: data
    }
}

export const CourierServiceType = (data) => {
    return {
        type: 'COURIERSERVICETYPE',
        payload: data
    }
}

export const InsuranceCheckbox = (bool) => {
    return {
        type: 'INSURANCECHECKBOX',
        payload: bool
    }
}

export const InsurancePrice = (data) => {
    return {
        type: 'INSURANCEPRICE',
        payload: data
    }
}

export const ReMapPickupType = (indexShipment, shipmentType) => {
    return {
        type: 'REMAPPICKUPTYPE',
        indexShipment: indexShipment,
        shipmentType: shipmentType
    }
}

export const ReMapPaymentType = (indexPayment, paymentType) => {
    return {
        type: 'REMAPPAYMENTTYPE',
        indexPayment: indexPayment,
        paymentType: paymentType
    }
}

export const OvoPhoneNumber = (data) => {
    return {
        type: 'PHONENUMBER',
        payload: data
    }
}

export const ShippingDateType = (data) => {
    return {
        type: 'SHIPPINGDATETYPE',
        payload: data
    }
}

export const ShippingDate = (data) => {
    return {
        type: 'SHIPPINGDATE',
        payload: data
    }
}

// Delivery Option Selected
export const ShipmentTypeDelivery = (data) => {
    return {
        type: 'SHIPPINGTYPE',
        payload: data
    }
}

export const ShipmentNotesDelivery = (data) => {
    return {
        type: 'SHIPPERNOTES',
        payload: data
    }
}

export const ShipmentWithCourier = (shippingName, shippingPrice, shippingDesc, courierServiceType, shippingCode, insuranceCheckbox, insurancePrice) => {
    return {
        type: 'SHIPPINGWITHCOURIER',
        shippingName, 
        shippingPrice, 
        shippingDesc, 
        courierServiceType, 
        shippingCode, 
        insuranceCheckbox, 
        insurancePrice
    }
}

export const PermissionLocation = (bool) => {
    return {
        type: 'PERMISSIONLOCATION',
        payload: bool
    }
}