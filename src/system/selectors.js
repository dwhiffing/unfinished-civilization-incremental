import { createSelector } from 'redux-orm'
import { totalResources } from '../shared/selectors'
import orm from '../orm'

export const getSystems = createSelector(orm.System)
export const getSystemPlanets = createSelector(orm.System.planets)
export const getSystemsCities = createSelector(
  orm.System.planets.map(
    orm.Planet.continents.map(orm.Continent.plots.map(orm.Plot.city)),
  ),
)
const getSystemStockpiles = createSelector(
  orm.System.planets.map(
    orm.Planet.continents.map(
      orm.Continent.plots.map(orm.Plot.city.stockpiles),
    ),
  ),
)

export const getSystemResourceTotals = createSelector(
  orm,
  getSystemStockpiles,
  (_, stockpiles) => totalResources(stockpiles.flat(5).filter((t) => !!t)),
)
