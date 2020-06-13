import random from 'lodash/random'
import times from 'lodash/times'
import { tasks } from '../../city/data'
import {
  SYSTEM_COUNT_RANGE,
  UNLOCK_ALL,
  resources,
  buyables,
  UNLOCKS,
} from '../../shared/data'
import { districtTypes } from '../../city/data'
import { createSystem } from '../../system/store'
import { createCityReducer } from '../../city/store'
import { updateResourceReducer } from './updateResource'
import { unlockReducer } from './unlock'
import { getFirst } from '../selectors'

export const createInitialReducer = (sess) => {
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
    unlockReducer(sess, 'center')
    updateResourceReducer(sess, { resourceId: 'food', cityId: 0, value: 100 })

    if (UNLOCK_ALL) {
      UNLOCKS.forEach((id) => unlockReducer(sess, id))
    }
  }

  return sess.state
}
