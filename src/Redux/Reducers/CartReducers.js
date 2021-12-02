const INITIAL_STATE = {
    pickupType: 0, //PICKUP PAGE
    fullAddress: "",
    shipperNotes: "",
    indexPickup: 0,
    shipperName: "",
    shipperPrice: "",
    shippingDateType : "",
    shippingDate : "",
    paymentType: -1, //PAYMENT PAGE
    phoneNumber: ""
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "PICKUPTYPE":
            return { ...state, pickupType: action.payload }
        case "FULLADDRESS":
            return { ...state, fullAddress: action.payload }
        case "SHIPPERNOTES":
            return { ...state, shipperNotes: action.payload }
        case "PICKUPPOINT":
            return { ...state, indexPickup: action.payload }
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
        case "DEFAULTSTATE":
            return INITIAL_STATE
        default:
            return state
    }
}