import {
  resources,
  tasks,
  buildingTypes,
  planets,
  buyables,
} from '../constants'
import { createPlanet } from './createPlanet'

// TODO: this should be called every start
// TODO: but first they have to not be persisted
export const createInitial = (sess) => {
  buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
  resources.forEach((resource) =>
    sess.Resource.create({ ...resource, amount: 0 }),
  )
  tasks.forEach((task) => sess.Task.create({ ...task }))
  buildingTypes.forEach(({ ...buildingType }) =>
    sess.BuildingType.create({ ...buildingType }),
  )

  // TODO: this should only be called if there is no planet
  planets.forEach((planet) => createPlanet(sess, planet))
  return sess.state
}
