import orm from '../orm'
import { createInitial } from './createInitial'
import { dragPerson } from './dragPerson'
import { applyTickEffects } from './applyTickEffects'
import { updateResource } from './updateResource'
import { createSeatReducer, createDistrictReducer } from '../city/store'
import { createPerson } from './createPerson'
import { createPlanet } from './createPlanet'
import { createCityReducer } from '../city/store'
import { createContinentReducer } from '../continent/store'
import { createPlot } from './createPlot'
import { explore } from './explore'
import { settle } from './settle'
import { createSystem } from './createSystem'

const reducers = {
  INIT: createInitial,
  CREATE_CONTINENT: createContinentReducer,
  EXPLORE: explore,
  SETTLE: settle,
  CREATE_CITY: createCityReducer,
  CREATE_SEAT: createSeatReducer,
  CREATE_PERSON: createPerson,
  CREATE_BUILDING: createDistrictReducer,
  CREATE_PLOT: createPlot,
  CREATE_PLANET: createPlanet,
  CREATE_SYSTEM: createSystem,
  UPDATE_RESOURCE: updateResource,
  TICK: applyTickEffects,
  DRAG: dragPerson,
}

export const reducer = (state = orm.getEmptyState(), action) => {
  const reducer = reducers[action.type]
  if (reducer) {
    return reducer(orm.session(state), action.payload)
  }
  return state
}
