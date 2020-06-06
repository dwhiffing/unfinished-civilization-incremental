import { createStore, combineReducers } from 'redux'
import { reducer } from './reducers'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { parse, stringify } from 'flatted'

const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState),
)

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [transformCircular],
  blacklist: ['BuildingType'],
}

const persistedReducer = persistReducer(persistConfig, reducer)
const rootReducer = combineReducers({ root: persistedReducer })
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
export const persistor = persistStore(store)

export default store
