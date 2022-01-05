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

export const GetCheckbox = (data) => {
    return {
        type: 'CHECKBOXES',
        payload: data
    }
}

export const CountCheckbox = (data) => {
    return {
        type: 'COUNTCHECKBOX',
        payload: data
    }
}

export const GetRadio = (data) => {
    return {
        type: 'RADIOBUTTON',
        payload: data
    }
}

export const EditMenuCart = (bool) => {
    return {
        type: 'EDITCART',
        payload: bool
    }
}

export const IsMerchantQR = (bool) => {
    return {
        type: 'ISMERCHANTQR',
        payload: bool
    }
}

export const DataOrder = (data) => {
    return {
        type: 'DATAORDER',
        payload: data
    }
}

export const DataDetail = (data) => {
    return {
        type: 'DATADETAIL',
        payload: data
    }
}

export const CustomerName = (data) => {
    return {
        type: 'CUSTOMERNAME',
        payload: data
    }
}

export const CustomerPhoneNumber = (data) => {
    return {
        type: 'CUSTOMERPHONENUMBER',
        payload: data
    }
}

export const IsManualTxn = (bool) => {
    return {
        type: 'ISMANUALTXN',
        payload: bool
    }
}