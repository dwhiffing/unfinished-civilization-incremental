import random from 'lodash/random'
import times from 'lodash/times'
import { SYSTEM_COUNT_RANGE, UNLOCKS, UNLOCK_ALL } from '../data'
import { resources, tasks, districtTypes, buyables } from '../data'
import { createSystem } from './createSystem'
import { createCityReducer } from '../city/store'
import { updateResource } from './updateResource'
import { unlock } from './unlock'
import { getFirst } from '../selectors'

export const createInitial = (sess) => {
  buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
  resources.forEach((resource) =>
    sess.Resource.create({ ...resource, amount: 0 }),
  )
  tasks.forEach((task) => sess.Task.create({ ...task }))
  districtTypes.forEach(({ ...districtType }) =>
    sess.DistrictType.create({ ...districtType }),
  )

  if (sess.System.all().toRefArray().length === 0) {
    times(random(...SYSTEM_COUNT_RANGE), () => createSystem(sess, {}))
    // create first city
    createCityReducer(sess, { plotId: getFirst(sess.Plot).id })
    unlock(sess, 'center')
    updateResource(sess, { resourceId: 'food', cityId: 0, value: 100 })

    if (UNLOCK_ALL) {
      UNLOCKS.forEach((id) => unlock(sess, id))
    }
  }

  return sess.state
}
