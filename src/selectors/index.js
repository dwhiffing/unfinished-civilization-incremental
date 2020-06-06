import { createSelector } from 'redux-orm'
import orm from '../models'

const getList = (model) => model.all().toModelArray()
const getFirst = (model) => getList(model)[0]
const totalResources = (list) => {
  let resources = {}
  list.forEach((resource) => {
    const { ref } = resource
    resources[ref.resourceId] = resources[ref.resourceId] || 0
    resources[ref.resourceId] += ref.amount
  })
  return resources
}

export const getPlanets = createSelector(orm, (session) =>
  getList(session.Planet).map((planet) => ({
    ...planet.ref,
    continents: planet.continents.all().toModelArray().map(makeGetContinent),
  })),
)

export const getContinents = createSelector(orm, (session) =>
  getList(session.Continent).map(makeGetContinent),
)

export const getCities = createSelector(orm, (session) =>
  getList(session.City).map(makeGetCity),
)

export const getBuyables = createSelector(orm, (session) =>
  session.Buyable.all().toRefArray(),
)

export const getPlanetResourceTotals = (planetId) =>
  createSelector(orm, (session) =>
    totalResources(
      getList(session.ResourceStockpile).filter(
        (r) =>
          getFirst(
            getFirst(getFirst(r.city).continent).planet,
          ).id.toString() === planetId,
      ),
    ),
  )

export const getContinentResourceTotals = (continentId) =>
  createSelector(orm, (session) =>
    totalResources(
      getList(session.ResourceStockpile).filter(
        (r) =>
          getFirst(getFirst(r.city).continent).id.toString() === continentId,
      ),
    ),
  )

export const getCityResourceTotals = (cityId) =>
  createSelector(orm, (session) =>
    totalResources(
      getList(session.ResourceStockpile).filter(
        (r) => getFirst(r.city).id.toString() === cityId,
      ),
    ),
  )

export const getResourceTotals = createSelector(orm, (session) => {
  let resources = {}
  getList(session.ResourceStockpile).forEach((resource) => {
    const { ref } = resource
    resources[ref.resourceId] = resources[ref.resourceId] || 0
    resources[ref.resourceId] += ref.amount
  })

  return resources
})

const makeGetContinent = (continent) => ({
  ...continent.ref,
  planet: getFirst(continent.planet.all()).ref,
  cities: getList(continent.cities).map(makeGetCity),
})

const makeGetCity = (city) => ({
  ...city.ref,
  people: city.people.toRefArray(),
  resources: city.resources.toRefArray(),
  continent: getFirst(city.continent).ref,
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
