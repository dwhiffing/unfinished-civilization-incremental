export const resources = [{ id: 'food' }, { id: 'wood' }]
export const cities = [{}]

export const buildingTypes = [
  { id: 'camp', tasks: [{ id: 'scavenge' }] },
  { id: 'lumbermill', tasks: [{ id: 'chop' }] },
]

export const tasks = [
  { id: 'chop', duration: 60, effect: { id: 'wood', value: 1 } },
  { id: 'scavenge', duration: 30, effect: { id: 'food', value: 1 } },
]
