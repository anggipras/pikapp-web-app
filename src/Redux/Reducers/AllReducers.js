const INITIAL_STATE = {
    buttonLoad: true,
    validQTY: 0,
}

export default (state = INITIAL_STATE, action)=> {
    switch (action.type) {
        case "LOADING":
            return {...state, buttonLoad: false}
        case "DONELOAD":
            return {...state, buttonLoad: true}
        case "VALIDATIONQTY":
            return {...state, validQTY: action.payload}
        default:
            return state
    }
}