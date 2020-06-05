import { createAction } from '@reduxjs/toolkit'

export const init = createAction('INIT')
export const tick = createAction('TICK')
export const drag = createAction('DRAG')
export const updateResource = createAction('UPDATE_RESOURCE')
export const createPerson = createAction('CREATE_PERSON')
export const createNation = createAction('CREATE_NATION')
export const createCity = createAction('CREATE_CITY')
export const createSeat = createAction('CREATE_SEAT', (building) => ({
  payload: { buildingId: building.id, task: building.seats[0].task },
}))
