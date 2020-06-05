import {
  resources,
  tasks,
  buildingTypes,
  nations,
  buyables,
} from '../constants'
import { createNation } from './createNation'

export const createInitialNation = (sess) => {
  buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
  resources.forEach((resource) =>
    sess.Resource.create({ ...resource, amount: 0 }),
  )
  tasks.forEach((task) => sess.Task.create({ ...task }))
  buildingTypes.forEach(({ ...buildingType }) =>
    sess.BuildingType.create({ ...buildingType }),
  )
  nations.forEach((nation) => createNation(sess, nation))
  return sess.state
}
