export const resources = [{ id: 'food' }, { id: 'wood' }]
export const cities = [
  {
    id: 'one',
    people: [
      { label: 'a' },
      { label: 'b' },
      { label: 'c' },
      { label: 'd' },
      { label: 'e' },
    ],
    resources: [
      { resourceId: 'food', amount: 0 },
      { resourceId: 'wood', amount: 0 },
    ],
    buildings: [{ buildingId: 'camp' }, { buildingId: 'lumbermill' }],
  },
  {
    id: 'two',
    people: [
      { label: 'a' },
      { label: 'b' },
      { label: 'c' },
      { label: 'd' },
      { label: 'e' },
    ],
    resources: [
      { resourceId: 'food', amount: 0 },
      { resourceId: 'wood', amount: 0 },
    ],
    buildings: [{ buildingId: 'camp' }, { buildingId: 'lumbermill' }],
  },
]
export const buildingTypes = [
  { id: 'camp', tasks: [{ id: 'scavenge', count: 3 }] },
  { id: 'lumbermill', tasks: [{ id: 'chop', count: 2 }] },
]
export const tasks = [
  { id: 'chop', duration: 60, effect: { id: 'wood', value: 1 } },
  { id: 'scavenge', duration: 30, effect: { id: 'food', value: 1 } },
]
