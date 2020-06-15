import sample from 'lodash/sample'
export { UNLOCKS } from './unlocks'
export { resources } from './resources'
export { buyables } from './buyables'

export const INTERVAL = 1000
export const RESOURCE_MULTIPLIER = 1
export const UNLOCK_ALL = false

export const SYSTEM_COUNT_RANGE = [3, 3]
export const PLANET_COUNT_RANGE = [2, 5]
export const CONTINENT_COUNT_RANGE = [2, 4]
export const PLOT_COUNT_RANGE = [2, 6]
export const FOOD_DRAIN = 0.2

export const getUniqueName = (model, list) => {
  const takenNames = model
    .all()
    .toRefArray()
    .map((p) => p.label)
  return sample(list.filter((p) => !takenNames.includes(p)))
}
