const INITIAL_STATE = {
    fullAddress: "",
    shipperNotes: "",
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "FULLADDRESS":
            return { ...state, fullAddress: action.payload }
        case "SHIPPERNOTES":
            return { ...state, shipperNotes: action.payload }
        case "DEFAULTSTATE":
            return INITIAL_STATE
        default:
            return state
    }
}