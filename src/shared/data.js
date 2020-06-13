import sample from 'lodash/sample'

export const INTERVAL = 500
export const RESOURCE_MULTIPLIER = 500
export const UNLOCK_ALL = true

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

export const resources = [
  { id: 'food', limit: 500, color: '#f95757' },
  { id: 'wood', limit: 100, color: '#905100' },
  { id: 'fur', limit: 100, color: '#d0865b' },
  { id: 'stone', limit: 100, color: '#8a8a8a' },
  { id: 'faith', limit: 100, color: '#9093ff' },
  { id: 'gold', limit: 100, color: '#f1ba1a' },
  { id: 'science', limit: 100, color: '#090eb5' },
  { id: 'culture', limit: 100, color: '#ab16c5' },
  { id: 'growth', limit: 100, color: '#000000' },
]

export const buyables = [
  {
    id: 'buySeat',
    label: '+ seat',
    cost: { wood: 10 },
  },
  {
    id: 'createDistrict',
    label: '+ district',
    cost: { wood: 50 },
  },
  {
    id: 'buyCity',
    label: '+ city',
    cost: { wood: 100 },
  },
  {
    id: 'exploreContinent',
    label: 'explore',
    cost: { wood: 1000 },
  },
  {
    id: 'settleContinent',
    label: 'settle continent',
    cost: { wood: 500 },
  },
  {
    id: 'explorePlanet',
    label: 'explore ocean',
    cost: { wood: 10000 },
  },
  {
    id: 'settlePlanet',
    label: 'settle planet',
    cost: { wood: 5000 },
  },
  {
    id: 'exploreSystem',
    label: 'explore stars',
    cost: { wood: 100000 },
  },
  {
    id: 'settleSystem',
    label: 'settle system',
    cost: { wood: 50000 },
  },
  {
    id: 'exploreGalaxy',
    label: 'explore systems',
    cost: { wood: 1000000 },
  },
]

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
