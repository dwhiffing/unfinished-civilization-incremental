import { createSelector } from 'redux-orm'
import compact from 'lodash/compact'
import { totalResources } from '../shared/selectors'
import orm from '../orm'

export const getPlanets = createSelector(orm.Planet)
export const getPlanetsSystem = createSelector(orm.Planet.system)
export const getPlanetsContinents = createSelector(orm.Planet.continents)
export const getPlanetsCities = createSelector(
  orm.Planet.continents.map(orm.Continent.plots.map(orm.Plot.city)),
)
export const getPlanetStockpiles = createSelector(
  orm.Planet.continents.map(orm.Continent.plots.map(orm.Plot.city.stockpiles)),
)
export const getPlanetResourceTotals = createSelector(
  orm,
  getPlanetStockpiles,
  (_, stockpiles) => totalResources(stockpiles.flat(5).filter((t) => !!t)),
)

export const getPlanetFull = createSelector(
  orm,
  getPlanets,
  getPlanetsSystem,
  getPlanetsContinents,
  getPlanetResourceTotals,
  (_, planet, system, continents, resources) => ({
    ...planet,
    system,
    continents: continents ? compact(continents.flat(2)) : [],
    resources,
  }),
)
