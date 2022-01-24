const INITIAL_STATE = {
    pickupType: -1, //PICKUP PAGE
    fullAddress: "",
    postalCode : "",
    shipperNotes: "",
    shipperName: "",
    shipperPrice: "",
    shippingDateType : "", //SHIPPING DATE PAGE
    shippingDate : "",
    paymentType: -1, //PAYMENT PAGE
    phoneNumber: "",
    customerName: "",
    customerPhoneNumber: "",
    mapInstance : "",
    mapApi : "",
    places : [],
    lat : 0,
    lng : 0,
    district : "",
    formattedAddress : "",
    shippingType : "",
    shippingName : "",
    shippingPrice : 0,
    shippingDesc : "",
    courierList : []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "PICKUPTYPE":
            return { ...state, pickupType: action.payload }
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
        case "DISTRICT":
            return { ...state, district: action.payload }
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
        case "COURIERLIST":
            return { ...state, courierList: action.payload }
        case "DEFAULTSTATE":
            return INITIAL_STATE
        default:
            return state
    }
}