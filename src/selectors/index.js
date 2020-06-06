import { createSelector } from 'redux-orm'
import orm from '../models'

export const getContinents = createSelector(orm, (session) =>
  session.Continent.all()
    .toModelArray()
    .map((continent) => ({
      ...continent.ref,
      cities: continent.cities.all().toModelArray().map(makeGetCity),
    })),
)

export const getCities = createSelector(orm, (session) =>
  session.City.all().toModelArray().map(makeGetCity),
)

const getResourceStockpilesForContinent = (session, continentId) =>
  session.ResourceStockpile.all()
    .toModelArray()
    .filter(
      (r) =>
        r.city
          .all()
          .toModelArray()[0]
          .continent.all()
          .toModelArray()[0]
          .id.toString() === continentId,
    )

export const getContinentResourceTotals = (continentId) =>
  createSelector(orm, (session) => {
    let resources = {}
    getResourceStockpilesForContinent(session, continentId).forEach(
      (resource) => {
        const { ref } = resource
        resources[ref.resourceId] = resources[ref.resourceId] || 0
        resources[ref.resourceId] += ref.amount
      },
    )

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
  continent: city.continent.all().toRefArray()[0],
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
