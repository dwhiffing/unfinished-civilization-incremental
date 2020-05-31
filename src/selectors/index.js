import { createSelector } from 'redux-orm'
import orm from '../orm'

export const getBuildings = createSelector(orm, (session) => {
  return session.Building.all()
    .toModelArray()
    .map((building) => {
      const { ref } = building
      return {
        ...ref,
        seats: building.seats.toRefArray().map((seat) => {
          return { ...seat, task: { ...seat.task.ref } }
        }),
      }
    })
})

export const getResources = createSelector(orm, (session) => {
  return session.Resource.all()
    .toModelArray()
    .map((resource) => {
      const { ref } = resource
      return { ...ref }
    })
})

export const getPeople = createSelector(orm, (session) => {
  return session.Person.all()
    .toModelArray()
    .map((person) => {
      const { ref } = person
      return { ...ref }
    })
})
