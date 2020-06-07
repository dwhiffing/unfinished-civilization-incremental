import { createAction } from '@reduxjs/toolkit'

export const createInitial = createAction('INIT')
export const tick = createAction('TICK')
export const drag = createAction('DRAG')
export const updateResource = createAction('UPDATE_RESOURCE')
export const createPerson = createAction('CREATE_PERSON')
export const createContinent = createAction('CREATE_CONTINENT')
export const explore = createAction('EXPLORE')
export const settle = createAction('SETTLE')
export const createCity = createAction('CREATE_CITY')
export const createPlanet = createAction('CREATE_PLANET')
export const createSeat = createAction('CREATE_SEAT', (building) => ({
  payload: { buildingId: building.id, task: building.seats[0].task },
}))
