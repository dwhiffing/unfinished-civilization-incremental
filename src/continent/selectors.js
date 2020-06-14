import { createSelector } from 'redux-orm'
import { totalResources } from '../shared/selectors'
import orm from '../orm'

export const getContinents = createSelector(orm.Continent)
export const getContinentsPlanet = createSelector(orm.Continent.planet)
export const getContinentsPlots = createSelector(orm.Continent.plots)
export const getContinentsCities = createSelector(
  orm.Continent.plots.map(orm.Plot.city),
)
export const getContinentResources = createSelector(
  orm.Continent.plots.map(orm.Plot.city.stockpiles),
)

export const getContinentResourceTotals = createSelector(
  orm,
  getContinentResources,
  (_, stockpiles) => totalResources(stockpiles.flat(5).filter((t) => !!t)),
)
