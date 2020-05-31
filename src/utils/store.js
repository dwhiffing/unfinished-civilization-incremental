import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reducer } from './reducer'

const rootReducer = combineReducers({
  root: reducer,
})
const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
