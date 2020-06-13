import orm from './models'

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

export const reducer = (state = orm.getEmptyState(), action) => {
  const reducer = reducers[action.type]
  if (reducer) {
    return reducer(orm.session(state), action.payload)
  }
  return state
}
