import { createSelector } from 'redux-orm'
import orm from '../orm'

export const getCities = createSelector(orm, (session) => {
  return session.City.all()
    .toModelArray()
    .map((city) => {
      const { ref } = city
      return {
        ...ref,
        people: city.people.toRefArray().map((person) => {
          return { ...person }
        }),
        resources: city.resources.toRefArray().map((resource) => {
          return { ...resource }
        }),
        buildings: city.buildings.toModelArray().map((building) => {
          const { ref } = building
          return {
            ...ref,
            label: building.buildingId,
            seats: building.seats.toRefArray().map((seat) => {
              return {
                ...seat,
                task: { ...seat.task.ref },
                building: { ...ref, cityId: city.id },
              }
            }),
          }
        }),
      }
    })
})

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
