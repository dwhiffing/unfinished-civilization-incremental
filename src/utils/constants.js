export const INITIAL_MONEY = 0
export const INTERVAL = 100

const RESOURCES = [{ label: 'food' }]

const BUILDINGS = [{ label: 'camp', tasks: ['scavenge'] }]

const TASKS = [
  { label: 'scavenge', duration: 1, effect: { label: 'food', value: 1 } },
]

export const INITIAL_STATE = {
  resources: RESOURCES.map((r) => ({ ...r, value: 0 })),
  buildings: BUILDINGS.map((b) => ({
    ...b,
    tasks: b.tasks.map((t) => ({ label: t, slots: [] })),
  })),
  tasks: TASKS.map((b) => ({
    ...b,
    level: 0,
    progress: 0,
    amount: 0,
  })),
  people: [{ id: 'dan' }, { id: 'nad' }],
}
