import orm from './models'
import { createInitial } from './shared/reducers/createInitial'
import { dragPerson } from './shared/reducers/dragPerson'
import { applyTickEffects } from './shared/reducers/applyTickEffects'
import { updateResource } from './shared/reducers/updateResource'
import { createSeatReducer, createDistrictReducer } from './city/store'
import { createPerson } from './shared/reducers/createPerson'
import { createPlanet } from './shared/reducers/createPlanet'
import { createCityReducer } from './city/store'
import { createContinentReducer } from './continent/store'
import { createPlot } from './shared/reducers/createPlot'
import { explore } from './shared/reducers/explore'
import { settle } from './shared/reducers/settle'
import { createSystem } from './shared/reducers/createSystem'

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
