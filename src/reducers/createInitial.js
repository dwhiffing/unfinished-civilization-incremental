import { resources, tasks, buildingTypes, buyables } from '../constants'
import { createPlanet } from './createPlanet'

export const createInitial = (sess) => {
  buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
  resources.forEach((resource) =>
    sess.Resource.create({ ...resource, amount: 0 }),
  )
  tasks.forEach((task) => sess.Task.create({ ...task }))
  buildingTypes.forEach(({ ...buildingType }) =>
    sess.BuildingType.create({ ...buildingType }),
  )

  if (sess.Planet.all().toRefArray().length === 0) {
    createPlanet(sess, {})
  }

  return sess.state
}
