import {combineReducers} from 'redux'
import AllReducers from './AllReducers'
import AuthenticationReducers from './AuthenticationReducers'
import CartReducers from './CartReducers'

export default combineReducers({
    AllRedu: AllReducers,
    AuthRedu: AuthenticationReducers,
    CartRedu: CartReducers
})