import { createSelector } from 'redux-orm'
import orm from '../models'

export const getList = (model) => {
  if (!model) debugger
  return model.all().toModelArray()
}
export const getFirst = (model) => getList(model)[0]
const totalResources = (list) => {
  let resources = {}
  list.forEach((resource) => {
    const { ref } = resource
    resources[ref.resourceId] = resources[ref.resourceId] || 0
    resources[ref.resourceId] += ref.amount
  })
  return resources
}

export const getFirstDeep = (thing, path) => {
  const paths = path.split('.')
  let resolved = thing
  while (paths.length > 0) {
    const p = paths.shift()
    resolved = getFirst(resolved[p])
  }
  return resolved
}

export const getPlanets = createSelector(orm, (session) =>
  getList(session.Planet).map((planet) => {
    const continents = planet.continents
      .all()
      .toModelArray()
      .map((continent) => makeGetContinent(session, continent))
    return {
      ...planet.ref,
      settled: continents.some((c) => c.settled),
      continents,
    }
  }),
)

export const getContinents = createSelector(orm, (session) =>
  getList(session.Continent).map((continent) =>
    makeGetContinent(session, continent),
  ),
)

export const getCities = createSelector(orm, (session) =>
  getList(session.City).map((city) => makeGetCity(session, city)),
)

export const getBuyables = createSelector(orm, (session) =>
  session.Buyable.all().toRefArray(),
)

export const getPlanetResourceTotals = (planetId) =>
  createSelector(orm, (session) =>
    totalResources(
      getList(session.ResourceStockpile).filter(
        (r) => getFirstDeep(r, 'city.plot.continent.planet').id === planetId,
      ),
    ),
  )

export const getContinentResourceTotals = (continentId) =>
  createSelector(orm, (session) =>
    totalResources(
      getList(session.ResourceStockpile).filter(
        (r) => getFirstDeep(r, 'city.plot.continent').id === continentId,
      ),
    ),
  )

export const getCityResourceTotals = (cityId) =>
  createSelector(orm, (session) =>
    totalResources(
      getList(session.ResourceStockpile).filter(
        (r) => getFirst(r.city).id === cityId,
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

const makeGetContinent = (session, continent) => ({
  explored: false,
  ...continent.ref,
  planet: getFirst(continent.planet.all()).ref,
  plots: getList(continent.plots).map((p) => ({
    id: p.id,
    city: getFirst(p.cities),
    ...p.ref,
  })),
  settled:
    getList(continent.plots)
      .map((p) => getFirst(p.cities))
      .filter((p) => !!p).length > 0,
  cities: getList(continent.plots)
    .map((p) => getFirst(p.cities))
    .filter((p) => !!p)
    .map((city) => makeGetCity(session, city)),
})

const makeGetCity = (sess, city) => ({
  ...city.ref,
  people: city.people.toRefArray(),
  resources: city.resources.toRefArray(),
  continent: getFirst(getFirst(city.plot).continent).ref,
  buildings: city.buildings.toModelArray().map((building) => ({
    ...building.ref,
    label: building.buildingId,
    seats: building.seats.toRefArray().map((seat) => ({
      ...seat,
      task: sess.Task.withId(seat.taskId),
      building: { ...building.ref, cityId: city.id },
      person: seat.person ? { ...seat.person._fields } : null,
    })),
  })),
})
