import { createSelector } from 'redux-orm'
import orm from '../orm'

export const getNations = createSelector(orm, (session) =>
  session.Nation.all()
    .toModelArray()
    .map((nation) => ({
      ...nation.ref,
      cities: nation.cities.all().toModelArray().map(makeGetCity),
    })),
)

export const getCities = createSelector(orm, (session) =>
  session.City.all().toModelArray().map(makeGetCity),
)

const getResourceStockpilesForNation = (session, nationId) =>
  session.ResourceStockpile.all()
    .toModelArray()
    .filter(
      (r) =>
        r.city
          .all()
          .toModelArray()[0]
          .nation.all()
          .toModelArray()[0]
          .id.toString() === nationId,
    )

export const getNationResourceTotals = (nationId) =>
  createSelector(orm, (session) => {
    let resources = {}
    getResourceStockpilesForNation(session, nationId).forEach((resource) => {
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

export const getBuyables = createSelector(orm, (session) =>
  session.Buyable.all().toRefArray(),
)

const makeGetCity = (city) => ({
  ...city.ref,
  people: city.people.toRefArray(),
  resources: city.resources.toRefArray(),
  nation: city.nation.all().toRefArray()[0],
  buildings: city.buildings.toModelArray().map((building) => ({
    ...building.ref,
    label: building.buildingId,
    seats: building.seats.toRefArray().map((seat) => ({
      ...seat,
      task: { ...seat.task._fields },
      building: { ...building.ref, cityId: city.id },
      person: seat.person ? { ...seat.person._fields } : null,
    })),
  })),
})
