import random from 'lodash/random'
import times from 'lodash/times'
import { resources, tasks, buildingTypes, buyables } from '../constants'
import { createPlanet } from './createPlanet'
import { createCity } from './createCity'

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
    times(random(6, 10), () => createPlanet(sess, {}))
    // create first city
    const plot = sess.Plot.all().toModelArray()[0]
    createCity(sess, { plotId: plot.id })
  }

  return sess.state
}
