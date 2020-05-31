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

export const getResourceTotals = createSelector(orm, (session) => {
  let resources = {}
  session.ResourceStockpile.all()
    .toModelArray()
    .forEach((resource) => {
      const { ref } = resource
      resources[ref.resourceId] = resources[ref.resourceId] || 0
      resources[ref.resourceId] += ref.amount
    })

  return resources
})
