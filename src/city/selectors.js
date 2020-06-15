import { createSelector } from 'redux-orm'
import { totalResources } from '../shared/selectors'
import orm from '../orm'
import { getCityResourceChange } from './store/getCityResourceChange'

export const getPerson = createSelector(orm.Person)
export const getDistrict = createSelector(orm.District)
export const getDistrictTypes = createSelector(orm.DistrictType)
export const getDistrictType = createSelector(orm.District.districtType)

export const getCity = createSelector(orm.City)
export const getCityPlot = createSelector(orm.City.plot)
export const getStockpiles = createSelector(orm.ResourceStockpile)
export const getCityResources = createSelector(orm.City.stockpiles)
export const getCityTiles = createSelector(orm.City.tiles)
export const getTiles = createSelector(orm.Tile)
export const getTilesDistrict = createSelector(orm.Tile.district)
export const getTilesPerson = createSelector(orm.Tile.person)
export const getCityContinent = createSelector(orm.City.plot.continent)

export const getCityResourceTotals = createSelector(
  orm,
  getCityResources,
  (_, stockpiles) => totalResources(stockpiles),
)

export const getCityPeople = createSelector(
  orm,
  orm.City.people,
  (state, people) =>
    people
      ? people
          .filter((s) => !!s)
          .map((p) => {
            const tile = state.Tile.all()
              .toModelArray()
              .find((s) => s.personId === p.id)
            return { ...p, tile: tile ? tile.ref : null }
          })
      : [],
)

export const getCityResourceStats = createSelector(
  orm,
  orm.City,
  orm.City.tiles,
  orm.City.people,
  (_, city, tiles, people) => {
    if (!city) {
      return null
    }
    return getCityResourceChange({
      housing: city.housing,
      tiles: tiles.map((t) => ({
        ...t,
        person: typeof t.personId === 'number',
      })),
      numPeople: people.length,
    })
  },
)

export const getCityFull = createSelector(
  orm,
  getCity,
  getCityPlot,
  getCityTiles,
  getCityResources,
  getCityContinent,
  getCityPeople,
  getCityResourceStats,
  (_, city, plot, tiles, resources, continent, people, resourceChange) => ({
    ...city,
    plot,
    tiles: tiles ? tiles.flat() : [],
    people,
    continent,
    resources,
    resourceChange,
  }),
)
