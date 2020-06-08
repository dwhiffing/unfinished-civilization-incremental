import random from 'lodash/random'
import times from 'lodash/times'
import { SYSTEM_COUNT_RANGE } from '../data'
import { resources, tasks, buildingTypes, buyables } from '../data'
import { createSystem } from './createSystem'
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

  if (sess.System.all().toRefArray().length === 0) {
    times(random(...SYSTEM_COUNT_RANGE), () => createSystem(sess, {}))
    // create first city
    const plot = sess.Plot.all().toModelArray()[0]
    createCity(sess, { plotId: plot.id })
  }

  return sess.state
}
