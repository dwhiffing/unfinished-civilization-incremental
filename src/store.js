import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { parse, stringify } from 'flatted'
import orm from './orm'
import { settleReducer } from './shared/store/settle'
import { exploreReducer } from './shared/store/explore'
import { updateResourceReducer } from './shared/store/updateResource'
import { applyTickEffectsReducer } from './shared/store/applyTickEffects'
import { createInitialReducer } from './shared/store/createInitial'
import { createPlanetReducer } from './planet/store'
import { createSystemReducer } from './system/store'
import { createPlotReducer, createContinentReducer } from './continent/store'
import { createCityReducer, createPersonReducer } from './city/store'
import { createBuildingReducer } from './city/store'
import { createDistrictReducer, dragReducer } from './city/store'
import { purchaseBuyableReducer } from './shared/store'

const reducers = {
  INIT: createInitialReducer,
  CREATE_CONTINENT: createContinentReducer,
  CREATE_BUILDING: createBuildingReducer,
  EXPLORE: exploreReducer,
  SETTLE: settleReducer,
  CREATE_CITY: createCityReducer,
  CREATE_PERSON: createPersonReducer,
  CREATE_DISTRICT: createDistrictReducer,
  CREATE_PLOT: createPlotReducer,
  CREATE_PLANET: createPlanetReducer,
  CREATE_SYSTEM: createSystemReducer,
  UPDATE_RESOURCE: updateResourceReducer,
  PURCHASE_BUYABLE: purchaseBuyableReducer,
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

const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState),
)

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [transformCircular],
}

const persistedReducer = persistReducer(persistConfig, reducer)
const rootReducer = combineReducers({ root: persistedReducer })
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
export const persistor = persistStore(store)

export default store
