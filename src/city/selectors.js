import { createSelector } from 'redux-orm'
import { totalResources } from '../shared/selectors'
import orm from '../orm'
import {
  getCityResourceChange,
  getTileResourceChange,
} from './store/getCityResourceChange'

export const getPerson = createSelector(orm.Person)
export const getDistrict = createSelector(orm.District)
export const getDistrictTypes = createSelector(orm.DistrictType)
export const getDistrictType = createSelector(orm.District.districtType)

export const getCity = createSelector(orm.City)
export const getCityPlot = createSelector(orm.City.plot)
export const getStockpiles = createSelector(orm.ResourceStockpile)
export const getCityResources = createSelector(orm.City.stockpiles)
export const getTiles = createSelector(orm.Tile)
export const getTilesDistrict = createSelector(orm.Tile.district)
export const getTilesDistrictType = createSelector(
  orm.Tile.district.districtType,
)
export const getTilesPerson = createSelector(orm.Tile.person)
export const getCityContinent = createSelector(orm.City.plot.continent)

export const getFullTile = createSelector(
  orm,
  getTiles,
  getTilesDistrict,
  getTilesDistrictType,
  getTilesPerson,
  (_, tile, district, districtType, person) => {
    if (!tile) {
      return null
    }
    const _tile = {
      ...tile,
      district: { ...(district || {}), districtType },
      person,
    }

    return { ..._tile, resourceChange: getTileResourceChange(_tile) }
  },
)

export const getCityTiles = createSelector(
  orm,
  orm.City.tiles,
  orm.City.tiles.map(getFullTile),
)

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
  orm.City.tiles.map(orm.Tile.district),
  orm.City.people,
  (_, city, tiles, districts, people) => {
    if (!city) {
      return null
    }
    return getCityResourceChange({
      housing: city.housing,
      tiles: tiles.map((t, i) => ({
        ...t,
        district: districts[i],
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
