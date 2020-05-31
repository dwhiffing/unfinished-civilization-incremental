export const resources = [{ id: 'food' }, { id: 'wood' }]
export const buildings = [
  { id: 'camp', tasks: [{ id: 'scavenge', count: 3 }] },
  { id: 'lumber', tasks: [{ id: 'chop', count: 2 }] },
]
export const tasks = [
  { id: 'chop', duration: 60, effect: { id: 'wood', value: 1 } },
  { id: 'scavenge', duration: 30, effect: { id: 'food', value: 1 } },
]
export const people = [
  { id: 'a' },
  { id: 'b' },
  { id: 'c' },
  { id: 'd' },
  { id: 'e' },
]
