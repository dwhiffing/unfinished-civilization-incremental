import { createSelector } from 'redux-orm'
import orm from '../models'
import { getList, totalResources, getFirst } from '../shared/selectors'
import { getStockpiles } from '../city/selectors'
import { makeGetCity } from '../city/selectors'

export const getContinents = createSelector(orm, (session) =>
  getList(session.Continent).map((continent) =>
    makeGetContinent(session, continent),
  ),
)

export const getContinentResourceTotals = (continentId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(
      stockpiles.filter((r) => r.city.first().continentId === continentId),
    ),
  )

export const makeGetContinent = (session, continent) => ({
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
