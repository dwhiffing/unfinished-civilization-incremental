import orm from '../models'
import { createInitial } from './createInitial'
import { dragPerson } from './dragPerson'
import { applyTickEffects } from './applyTickEffects'
import { updateResource } from './updateResource'
import { createSeat } from './createSeat'
import { createPerson } from './createPerson'
import { createPlanet } from './createPlanet'
import { createCity } from './createCity'
import { createContinent } from './createContinent'
import { createDistrict } from './createDistrict'
import { createPlot } from './createPlot'
import { explore } from './explore'
import { settle } from './settle'
import { createSystem } from './createSystem'

const reducers = {
  INIT: createInitial,
  CREATE_CONTINENT: createContinent,
  EXPLORE: explore,
  SETTLE: settle,
  CREATE_CITY: createCity,
  CREATE_SEAT: createSeat,
  CREATE_PERSON: createPerson,
  CREATE_BUILDING: createDistrict,
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
