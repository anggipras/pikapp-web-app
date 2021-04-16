import {combineReducers} from 'redux'
import AllReducers from './AllReducers'
import AuthenticationReducers from './AuthenticationReducers'

export default combineReducers({
    AllRedu: AllReducers,
    AuthRedu: AuthenticationReducers
})