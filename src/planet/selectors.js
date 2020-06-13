import { createSelector } from 'redux-orm'
import orm from '../models'
import { getStockpiles } from '../city/selectors'
import { getList, getFirst, totalResources } from '../shared/selectors'
import { makeGetContinent } from '../continent/selectors'

export const getPlanets = createSelector(orm, (session) =>
  getList(session.Planet).map((planet) => makeGetPlanet(session, planet)),
)

export const getPlanetResourceTotals = (planetId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(
      stockpiles.filter((r) => r.city.first().planetId === planetId),
    ),
  )

export const makeGetPlanet = (session, planet) => {
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
