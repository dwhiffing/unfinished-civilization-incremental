import {
  resources,
  tasks,
  buildingTypes,
  continents,
  buyables,
} from '../constants'
import { createContinent } from './createContinent'

export const createInitialContinent = (sess) => {
  buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
  resources.forEach((resource) =>
    sess.Resource.create({ ...resource, amount: 0 }),
  )
  tasks.forEach((task) => sess.Task.create({ ...task }))
  buildingTypes.forEach(({ ...buildingType }) =>
    sess.BuildingType.create({ ...buildingType }),
  )
  continents.forEach((continent) => createContinent(sess, continent))
  return sess.state
}
