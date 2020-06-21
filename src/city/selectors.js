import { createSelector } from 'redux-orm'
import mapValues from 'lodash/mapValues'
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
export const getTilesDistrict = createSelector(
  orm,
  orm.Tile.district,
  (_, district) =>
    district && {
      ...district,
      buildings: mapValues(district.buildings || {}, ({ id, ...rest }) => {
        const building = _.Building.withId(id)
        return { ...building._fields, ...rest }
      }),
    },
)
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
      district: district ? { ...district, districtType } : null,
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

export const getCityHousing = createSelector(
  orm,
  orm.City,
  orm.City.tiles.map(getTilesDistrict),
  (_, city, districts) => {
    if (!city) {
      return null
    }

    return districts
      .filter((b) => b && b.buildings)
      .map((d) => Object.values(d.buildings).map((b) => b.effects))
      .flat()
      .reduce((sum, e) => sum + e.housing, city.housing)
  },
)

export const getCityResourceStats = createSelector(
  orm,
  orm.City,
  orm.City.tiles,
  orm.City.tiles.map(getTilesDistrict),
  orm.City.people,
  getCityHousing,
  (_, city, tiles, districts, people, housing) => {
    if (!city) {
      return null
    }
    // TODO: need a better way to ensure this function is called with the same data as the selector
    const _tiles = tiles.map((t, i) => ({
      ...t,
      district: districts[i],
      person: typeof t.personId === 'number',
    }))
    return getCityResourceChange({
      housing,
      tiles: _tiles,
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
  getCityHousing,
  (
    _,
    city,
    plot,
    tiles,
    resources,
    continent,
    people,
    resourceChange,
    housing,
  ) => ({
    ...city,
    plot,
    tiles: tiles ? tiles.flat() : [],
    people,
    continent,
    resources,
    housing,
    resourceChange,
  }),
)
