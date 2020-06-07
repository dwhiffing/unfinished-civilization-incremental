export const RESOURCE_MULTIPLIER = 50
export const resources = [{ id: 'food' }, { id: 'wood' }]
export const buyables = [
  {
    id: 'buyPlanet',
    label: '+ planet',
    cost: { wood: 10000 },
  },
  {
    id: 'buyCity',
    label: '+ city',
    cost: { wood: 100 },
  },
  {
    id: 'buySeat',
    label: '+ seat',
    cost: { wood: 10 },
  },
  {
    id: 'buyPerson',
    label: '+ person',
    cost: { food: 5 },
  },
  {
    id: 'exploreSystem',
    label: 'explore stars',
    cost: { wood: 10 },
  },
  {
    id: 'explorePlanet',
    label: 'explore ocean',
    cost: { wood: 10 },
  },
  {
    id: 'exploreContinent',
    label: 'explore',
    cost: { wood: 10 },
  },
  {
    id: 'settlePlanet',
    label: 'settle planet',
    cost: { wood: 10 },
  },
  {
    id: 'settleContinent',
    label: 'settle continent',
    cost: { wood: 10 },
  },
]

export const buildingTypes = [
  { id: 'camp', tasks: [{ id: 'scavenge' }] },
  { id: 'lumbermill', tasks: [{ id: 'chop' }] },
]
export const tasks = [
  { id: 'chop', duration: 1, effect: { id: 'wood', value: 1 } },
  { id: 'scavenge', duration: 1, effect: { id: 'food', value: 1 } },
]
