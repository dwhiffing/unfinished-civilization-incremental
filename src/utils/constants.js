export const INITIAL_MONEY = 0
export const INTERVAL = 500

const generateSlots = (num) => {
  let slots = []
  let i = num
  while (i-- > 0) {
    slots.push({ list: [], progress: 0 })
  }

  return slots
}

const RESOURCES = { food: { label: 'food', value: 0 } }

const BUILDINGS = {
  camp: {
    label: 'camp',
    tasks: { scavenge: { label: 'scavenge', slots: generateSlots(2) } },
  },
}

const TASKS = {
  scavenge: {
    label: 'scavenge',
    duration: 1,
    progress: 0,
    effect: { label: 'food', value: 1 },
  },
}

const PEOPLE = [{ id: 'dan' }, { id: 'nad' }]

// need to move progress to building
export const INITIAL_STATE = {
  resources: RESOURCES,
  buildings: BUILDINGS,
  tasks: TASKS,
  people: PEOPLE,
}
