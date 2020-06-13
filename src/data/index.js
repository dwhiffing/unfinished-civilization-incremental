import sample from 'lodash/sample'
export { CITIES } from './cities'
export { PLANETS, TYPES as PLANET_TYPES } from './planets'
export { SYSTEMS } from './systems'
export { CONTINENTS } from './continents'
export { buildingTypes } from './buildingTypes'
export { tasks } from './tasks'
export { buyables } from './buyables'
export { resources } from './resources'

export const getUniqueName = (model, list) => {
  const takenNames = model
    .all()
    .toRefArray()
    .map((p) => p.label)
  return sample(list.filter((p) => !takenNames.includes(p)))
}

export const SYSTEM_COUNT_RANGE = [3, 3]
export const PLANET_COUNT_RANGE = [2, 5]
export const CONTINENT_COUNT_RANGE = [2, 4]
export const PLOT_COUNT_RANGE = [2, 6]
export const RESOURCE_MULTIPLIER = 500
export const UNLOCK_ALL = false
export const FOOD_DRAIN = 0.2

export const UNLOCKS = [
  'food',
  'wood',
  'fur',
  'stone',
  'faith',
  'gold',
  'science',
  'culture',
  'center',
  'scavenge',
  'barracks',
  'hunt',
  'industry',
  'mine',
  'chop',
  'church',
  'pray',
  'campus',
  'study',
  'market',
  'trade',
  'theatre',
  'perform',
  'galaxy',
  'system',
  'planet',
  'continent',
]
