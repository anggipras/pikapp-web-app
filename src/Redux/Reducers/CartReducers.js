const INITIAL_STATE = {
    pickupType: -1, //PICKUP PAGE
    pickupTitleType: "",
    fullAddress: "",
    postalCode : "",
    shipperNotes: "",
    shipperName: "",
    shipperPrice: "",
    shippingDateType : "", //SHIPPING DATE PAGE
    shippingDate : "",
    paymentType: -1, //PAYMENT PAGE
    paymentTitleType: "",
    phoneNumber: "",
    customerName: "",
    customerPhoneNumber: "",
    mapInstance : "",
    mapApi : "",
    places : [],
    lat : 0,
    lng : 0,
    center : [],
    streetNumber : "",
    streetName : "",
    district : "",
    city : "",
    province : "",
    formattedAddress : "",
    shippingType : "",
    shippingName : "",
    shippingPrice : 0,
    shippingDesc : "",
    shippingCode : "",
    courierList : [],
    isMarkerChange : false,
    searchInput : "",
    courierServiceType : "",
    insuranceCheckbox : false,
    insurancePrice : 0
    // dataDetailTxn : {}
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "PICKUPTYPE":
            return { ...state, pickupType: action.payload }
        case "REMAPPICKUPTYPE":
            return { ...state, pickupType: action.indexShipment, pickupTitleType: action.shipmentType }
        case "FULLADDRESS":
            return { ...state, fullAddress: action.payload }
        case "POSTALCODE":
            return { ...state, postalCode: action.payload }
        case "SHIPPERNOTES":
            return { ...state, shipperNotes: action.payload }
        case "SHIPPERNAME":
            return { ...state, shipperName: action.payload }
        case "SHIPPERPRICE":
            return { ...state, shipperPrice: action.payload }
        case "SHIPPINGDATETYPE":
            return { ...state, shippingDateType: action.payload }
        case "SHIPPINGDATE":
            return { ...state, shippingDate: action.payload }
        case "PAYMENTTYPE":
            return { ...state, paymentType: action.payload }
        case "REMAPPAYMENTTYPE":
            return { ...state, paymentType: action.indexPayment, paymentTitleType: action.paymentType }
        case "PHONENUMBER":
            return { ...state, phoneNumber: action.payload }
        case "CUSTOMERNAME":
            return { ...state, customerName: action.payload }
        case "CUSTOMERPHONENUMBER":
            return { ...state, customerPhoneNumber: action.payload }
        case "MAPINSTANCE":
            return { ...state, mapInstance: action.payload }
        case "MAPAPI":
            return { ...state, mapApi: action.payload }
        case "PLACES":
            return { ...state, places: action.payload }
        case "LAT":
            return { ...state, lat: action.payload }
        case "LNG":
            return { ...state, lng: action.payload }
        case "CENTER":
            return { ...state, center: action.payload }
        case "STREETNUMBER":
            return { ...state, streetNumber: action.payload }
        case "STREETNAME":
            return { ...state, streetName: action.payload }
        case "DISTRICT":
            return { ...state, district: action.payload }
        case "CITY":
            return { ...state, city: action.payload }
        case "PROVINCE":
            return { ...state, province: action.payload }
        case "FORMATTEDADDRESS":
            return { ...state, formattedAddress: action.payload }
        case "SHIPPINGTYPE":
            return { ...state, shippingType: action.payload }
        case "SHIPPINGNAME":
            return { ...state, shippingName: action.payload }
        case "SHIPPINGPRICE":
            return { ...state, shippingPrice: action.payload }
        case "SHIPPINGDESC":
            return { ...state, shippingDesc: action.payload }
        case "SHIPPINGCODE":
            return { ...state, shippingCode: action.payload }            
        case "COURIERLIST":
            return { ...state, courierList: action.payload }
        case "ISMARKERCHANGE":
            return { ...state, isMarkerChange: action.payload }
        case "SEARCHINPUT":
            return { ...state, searchInput: action.payload }
        case "COURIERSERVICETYPE":
            return { ...state, courierServiceType: action.payload }
        case "INSURANCECHECKBOX":
            return { ...state, insuranceCheckbox: action.payload }
        case "INSURANCEPRICE":
            return { ...state, insurancePrice: action.payload }
        // case "DATADETAILTXN":
        //     return { ...state, dataDetailTxn: action.payload }
        case "DEFAULTSTATE":
            return INITIAL_STATE
        default:
            return state
    }
}