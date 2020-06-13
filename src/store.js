import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { parse, stringify } from 'flatted'
import orm from './orm'
import {
  createInitialReducer,
  applyTickEffectsReducer,
  updateResourceReducer,
  exploreReducer,
  settleReducer,
} from './shared/store'
import { createPlanet } from './planet/store'
import { createSystem } from './system/store'
import { createPlotReducer, createContinentReducer } from './continent/store'
import {
  createCityReducer,
  createSeatReducer,
  createDistrictReducer,
  dragReducer,
  createPersonReducer,
} from './city/store'

const reducers = {
  INIT: createInitialReducer,
  CREATE_CONTINENT: createContinentReducer,
  EXPLORE: exploreReducer,
  SETTLE: settleReducer,
  CREATE_CITY: createCityReducer,
  CREATE_SEAT: createSeatReducer,
  CREATE_PERSON: createPersonReducer,
  CREATE_BUILDING: createDistrictReducer,
  CREATE_PLOT: createPlotReducer,
  CREATE_PLANET: createPlanet,
  CREATE_SYSTEM: createSystem,
  UPDATE_RESOURCE: updateResourceReducer,
  TICK: applyTickEffectsReducer,
  DRAG: dragReducer,
}

const reducer = (state = orm.getEmptyState(), action) => {
  const reducer = reducers[action.type]
  if (reducer) {
    return reducer(orm.session(state), action.payload)
  }
  return state
}

const CONSTANT_MODELS = ['DistrictType', 'Resource', 'Task', 'Buyable']
const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState),
)

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [transformCircular],
  blacklist: CONSTANT_MODELS,
}

const persistedReducer = persistReducer(persistConfig, reducer)
const rootReducer = combineReducers({ root: persistedReducer })
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
export const persistor = persistStore(store)

export default store
