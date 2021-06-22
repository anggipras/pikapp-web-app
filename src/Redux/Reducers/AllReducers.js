const INITIAL_STATE = {
    buttonLoad: true,
    validQTY: 0,
    openSelect: false,
    foodCateg: '',
    checkboxes: [],
    checkboxesTotal: [],
    mandatCheckCond: false,
    mandatCheck: false,
    radiobutton: [],
    mandatRadioCond: false,
    mandatRadio: false,
    totalAmountProd: 0,
    openMenuCart: false,
    dataOrder : {},
    fcmToken : '',
    transactionId : '',
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOADING":
            return { ...state, buttonLoad: false }
        case "DONELOAD":
            return { ...state, buttonLoad: true }
        case "VALIDATIONQTY":
            return { ...state, validQTY: action.payload }
        case "OPENSELECT":
            return { ...state, openSelect: action.payload }
        case "FOODCATEG":
            return { ...state, foodCateg: action.payload }
        case "CHECKBOXES":
            return { ...state, checkboxes: action.payload }
        case "MANDATCHECKCOND":
            return { ...state, mandatCheckCond: action.payload }
        case "MANDATCHECK":
            return { ...state, mandatCheck: action.payload }
        case "COUNTCHECKBOX":
            return { ...state, checkboxesTotal: action.payload }
        case "RADIOBUTTON":
            return { ...state, radiobutton: action.payload }
        case "MANDATRADIOCOND":
            return { ...state, mandatRadioCond: action.payload }
        case "MANDATRADIO":
            return { ...state, mandatRadio: action.payload }
        case "COUNTTOTAL":
            return { ...state, totalAmountProd: action.payload }
        case "EDITCART":
            return { ...state, openMenuCart: action.payload }
        case "DATAORDER":
            return { ...state, dataOrder: action.payload }
        case "FCMTOKEN":
            return { ...state, fcmToken: action.payload }
        case "TRANSACTIONID":
            return { ...state, transactionId: action.payload }
        case "DEFAULTSTATE":
            return INITIAL_STATE
        default:
            return state
    }
}