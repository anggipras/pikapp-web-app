const INITIAL_STATE = {
    dataRegister : {},
    dataLogin : {},
    isLoginStep : false,
    dataResetPin : {},
    dataPin : '',
    dataPinToken: '',
    isMerchantQR: false,
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "REGISTER" :
            return {...state, dataRegister: action.payload}
        case "LOGIN" :
            return {...state, dataLogin: action.payload}
        case "LOGINSTEP" :
            return {...state, isLoginStep: action.payload}
        case "RESETPIN" :
            return {...state, dataResetPin: action.payload}
        case "PIN" :
            return {...state, dataPin: action.payload}
        case "PINTOKEN" :
            return {...state, dataPinToken: action.payload}
        case "ISMERCHANTQR":
            return { ...state, isMerchantQR: action.payload }
        default:
            return state
    }
}