const INITIAL_STATE = {
    buttonLoad: true,
    validQTY: 0,
    openSelect: false,
    foodCateg: '',
    checkboxes: [],
    checkboxesTotal: [],
    radiobutton: [],
    openMenuCart: false
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
        case "COUNTCHECKBOX":
            return { ...state, checkboxesTotal: action.payload }
        case "RADIOBUTTON":
            return { ...state, radiobutton: action.payload }
        case "EDITCART":
            return { ...state, openMenuCart: action.payload }
        case "DEFAULTSTATE":
            return INITIAL_STATE
        default:
            return state
    }
}