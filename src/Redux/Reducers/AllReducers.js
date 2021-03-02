const INITIAL_STATE = {
    loadButton: true,
}

export default (state = INITIAL_STATE, action)=> {
    switch (action.type) {
        case "LOADING":
            return {...state, loadButton: false}
        case "DONELOAD":
            return {...state, loadButton: true}
        default:
            return state
    }
}