export const INITIAL_MONEY = 0
export const INTERVAL = 100

const RESOURCES = [{ label: 'food' }, { label: 'wood' }]

const TASKS = [
  { label: 'scavenge', duration: 1, effect: { label: 'food', value: 1 } },
  { label: 'chop', duration: 1, effect: { label: 'wood', value: 1 } },
]

export const INITIAL_STATE = {
  resources: [...RESOURCES].map((r) => ({ ...r, value: 0 })),
  tasks: [...TASKS].map((b) => ({
    ...b,
    level: 0,
    progress: 0,
  })),
}
