const INITIAL_STATE = {
    buttonLoad: true,
}

export default (state = INITIAL_STATE, action)=> {
    switch (action.type) {
        case "LOADING":
            return {...state, buttonLoad: false}
        case "DONELOAD":
            return {...state, buttonLoad: true}
        default:
            return state
    }
}