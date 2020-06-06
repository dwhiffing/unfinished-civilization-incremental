import orm from '../models'
import { createInitial } from './createInitial'
import { dragPerson } from './dragPerson'
import { tickBuildings } from './tickBuildings'
import { updateResource } from './updateResource'
import { createSeat } from './createSeat'
import { createPerson } from './createPerson'
import { createPlanet } from './createPlanet'
import { createCity } from './createCity'
import { createContinent } from './createContinent'

const reducers = {
  INIT: createInitial,
  CREATE_CONTINENT: createContinent,
  CREATE_CITY: createCity,
  CREATE_SEAT: createSeat,
  CREATE_PERSON: createPerson,
  CREATE_PLANET: createPlanet,
  UPDATE_RESOURCE: updateResource,
  TICK: tickBuildings,
  DRAG: dragPerson,
}

export const reducer = (state = orm.getEmptyState(), action) => {
  const reducer = reducers[action.type]
  if (reducer) {
    return reducer(orm.session(state), action.payload)
  }
  return state
}
