import { createSelector } from 'redux-orm'
import orm from '../orm'

export const getNations = createSelector(orm, (session) => {
  return session.Nation.all()
    .toModelArray()
    .map((nation) => {
      const { ref } = nation
      return {
        ...ref,
        cities: nation.cities.all().toModelArray().map(makeGetCity),
      }
    })
})

export const getCities = createSelector(orm, (session) => {
  return session.City.all().toModelArray().map(makeGetCity)
})

export const getNationResourceTotals = (nationId) =>
  createSelector(orm, (session) => {
    let resources = {}
    session.ResourceStockpile.all()
      .toModelArray()
      .filter((r) => {
        return (
          r.city
            .all()
            .toModelArray()[0]
            .nation.all()
            .toModelArray()[0]
            .id.toString() === nationId
        )
      })
      .forEach((resource) => {
        const { ref } = resource
        resources[ref.resourceId] = resources[ref.resourceId] || 0
        resources[ref.resourceId] += ref.amount
      })

    return resources
  })

export const getPlanetResourceTotals = createSelector(orm, (session) => {
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

export const getBuyables = createSelector(orm, (session) => {
  return session.Buyable.all()
    .toModelArray()
    .map((resource) => {
      const { ref } = resource
      return {
        ...ref,
      }
    })
})

const makeGetCity = (city) => {
  const { ref } = city
  return {
    ...ref,
    people: city.people.toRefArray().map((person) => {
      return { ...person }
    }),
    resources: city.resources.toRefArray().map((resource) => {
      return { ...resource }
    }),
    nation: city.nation.all().toRefArray()[0],
    buildings: city.buildings.toModelArray().map((building) => {
      const { ref } = building
      return {
        ...ref,
        label: building.buildingId,
        seats: building.seats.toRefArray().map((seat) => {
          return {
            ...seat,
            task: { ...seat.task._fields },
            building: { ...ref, cityId: city.id },
            person: seat.person ? { ...seat.person._fields } : null,
          }
        }),
      }
    }),
  }
}
