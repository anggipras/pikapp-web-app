export const LoadingButton = () => {
    return {
        type: 'LOADING'
    }
}

export const DoneLoad = () => {
    return {
        type: 'DONELOAD'
    }
}

export const ValidQty = (num) => {
    return {
        type: 'VALIDATIONQTY',
        payload: num
    }
}

export const OpenSelect = (bool) => {
    return {
        type: 'OPENSELECT',
        payload: bool
    }
}