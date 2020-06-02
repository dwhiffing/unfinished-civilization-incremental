export const init = () => ({ type: 'INIT' })
export const tick = () => ({ type: 'TICK' })

export const drag = (payload) => ({ type: 'DRAG', payload })

export function createPerson(cityId) {
  return {
    type: 'CREATE_PERSON',
    payload: { cityId: cityId },
  }
}

export function createCity({ nationId }) {
  return {
    type: 'CREATE_CITY',
    payload: { nationId },
  }
}

export function createNation() {
  return {
    type: 'CREATE_NATION',
  }
}

export function createSeat(building) {
  return {
    type: 'CREATE_SEAT',
    payload: { buildingId: building.id, task: building.seats[0].task },
  }
}
export function updateResource(resourceId, amount, cityId, nationId) {
  return {
    type: 'UPDATE_RESOURCE',
    payload: { resourceId, amount, cityId, nationId },
  }
}
