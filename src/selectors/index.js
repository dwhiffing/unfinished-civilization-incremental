import { createSelector } from 'redux-orm'
import orm from '../models'

export const getList = (model) => {
  if (!model) debugger
  return model.all().toModelArray()
}

export const getRefList = (model) => {
  if (!model) debugger
  return model.all().toRefArray()
}

export const getFirst = (model) => getList(model)[0]

const totalResources = (list) => {
  let resources = {}
  list.forEach((stockpile) => {
    const { ref } = stockpile
    resources[ref.resourceId] = resources[ref.resourceId] || {
      amount: 0,
      limit: 0,
      color: stockpile.resource && stockpile.resource.color,
    }
    resources[ref.resourceId].amount += ref.amount
    resources[ref.resourceId].limit += ref.limit
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

export const getUnlocks = createSelector(orm, (session) =>
  getList(session.Unlock).map((unlock) => unlock.ref.id),
)

export const getSystems = createSelector(orm, (session) =>
  getList(session.System).map((system) => {
    const planets = getList(system.planets).map((planet) =>
      makeGetPlanet(session, planet),
    )
    return {
      ...system.ref,
      settled: planets.some((p) => p.settled),
      planets,
    }
  }),
)

export const getPlanets = createSelector(orm, (session) =>
  getList(session.Planet).map((planet) => makeGetPlanet(session, planet)),
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

export const getBuildingTypes = createSelector(orm, (session) =>
  getList(session.BuildingType),
)

export const getStockpiles = createSelector(orm, (session) =>
  getList(session.ResourceStockpile),
)

export const getResourceTotals = createSelector(
  orm,
  getStockpiles,
  (_, stockpiles) => totalResources(stockpiles),
)

export const getSystemResourceTotals = (systemId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(
      stockpiles.filter((r) => r.city.first().systemId === systemId),
    ),
  )

export const getPlanetResourceTotals = (planetId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(
      stockpiles.filter((r) => r.city.first().planetId === planetId),
    ),
  )

export const getContinentResourceTotals = (continentId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(
      stockpiles.filter((r) => r.city.first().continentId === continentId),
    ),
  )

export const getCityResourceTotals = (cityId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(stockpiles.filter((r) => r.city.first().id === cityId)),
  )

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
  resources: getList(city.resources).map((r) => ({
    ...r.ref,
    color: sess.Resource.withId(r.resourceId)
      ? sess.Resource.withId(r.resourceId).ref.color
      : null,
  })),
  plot: getFirst(city.plot).ref,
  continent: getFirst(getFirst(city.plot).continent).ref,
  buildings: getList(city.buildings).map((building) => {
    const buildingType = sess.BuildingType.withId(building.buildingTypeId)
    return {
      ...building.ref,
      label: buildingType ? buildingType.label : null,
      seats: building.seats.toRefArray().map((seat) => ({
        ...seat,
        task: sess.Task.withId(seat.taskId)
          ? sess.Task.withId(seat.taskId).ref
          : null,
        building: { ...building.ref, cityId: city.id },
        person: seat.person ? { ...seat.person._fields } : null,
      })),
    }
  }),
})

const makeGetPlanet = (session, planet) => {
  const continents = getList(planet.continents).map((continent) =>
    makeGetContinent(session, continent),
  )
  return {
    ...planet.ref,
    settled: continents.some((c) => c.settled),
    system: getFirst(planet.system).ref,
    continents,
  }
}
