import { createStore } from 'redux'
// import Thunk from 'redux-thunk'
import Reducers from './Reducers'

const store = createStore(Reducers)

export default store