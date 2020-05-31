// TODO: black list these from persist so that balance changes apply

export const RESOURCE_MULTIPLIER = 50
export const resources = [{ id: 'food' }, { id: 'wood' }]
export const buyables = [
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
    id: 'buyNation',
    label: '+ nation',
    cost: { wood: 1000 },
  },
]

export const nations = [{}]
export const cities = [{}]

export const buildingTypes = [
  { id: 'camp', tasks: [{ id: 'scavenge' }] },
  { id: 'lumbermill', tasks: [{ id: 'chop' }] },
]
export const tasks = [
  { id: 'chop', duration: 5, effect: { id: 'wood', value: 1 } },
  { id: 'scavenge', duration: 3, effect: { id: 'food', value: 1 } },
]
