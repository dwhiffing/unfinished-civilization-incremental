import { createSelector } from 'redux-orm'
import compact from 'lodash/compact'
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

export const getContinentFull = createSelector(
  orm,
  getContinents,
  getContinentsPlanet,
  getContinentsCities,
  getContinentsPlots,
  getContinentResources,
  (_, continent, planet, cities, plots, resources) => ({
    ...continent,
    planet,
    plots,
    cities: cities ? compact(cities.flat()) : [],
    resources: resources ? compact(resources.flat()) : [],
  }),
)
