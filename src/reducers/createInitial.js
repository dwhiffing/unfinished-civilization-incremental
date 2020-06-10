import random from 'lodash/random'
import times from 'lodash/times'
import { SYSTEM_COUNT_RANGE } from '../data'
import { resources, tasks, buildingTypes, buyables } from '../data'
import { createSystem } from './createSystem'
import { createCity } from './createCity'
import { updateResource } from './updateResource'
import { unlock } from './unlock'

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
    unlock(sess, 'center')
    updateResource(sess, { resourceId: 'food', cityId: 0, value: 100 })

    // Unlock all
    // UNLOCKS.forEach((id) => unlock(sess, id))
  }

  return sess.state
}
