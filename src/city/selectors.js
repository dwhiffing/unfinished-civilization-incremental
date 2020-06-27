import { createSelector } from 'redux-orm'
import mapValues from 'lodash/mapValues'
import mergeWith from 'lodash/mergeWith'
import sample from 'lodash/sample'
import orm from '../orm'
import { totalResources } from '../shared/selectors'
import { FOOD_DRAIN, RESOURCE_MULTIPLIER } from '../shared/data'
import { BASE_EFFECTS, RESOURCE_EFFECTS } from './models/Tile'

export const getPerson = createSelector(orm.Person)
export const getDistrict = createSelector(orm.District)
export const getDistrictTypes = createSelector(orm.DistrictType)
export const getDistrictType = createSelector(orm.District.districtType)

export const getCity = createSelector(orm.City)
export const getCityPlot = createSelector(orm.City.plot)
export const getStockpiles = createSelector(orm.ResourceStockpile)
export const getCityResources = createSelector(orm.City.stockpiles)
export const getTiles = createSelector(orm.Tile)
export const getTilesPerson = createSelector(orm.Tile.person)
export const getCityContinent = createSelector(orm.City.plot.continent)
export const getTilesDistrictType = createSelector(
  orm.Tile.district.districtType,
)

export const getCityResourceTotals = createSelector(
  orm,
  getCityResources,
  (_, stockpiles) => totalResources(stockpiles),
)

export const getTilesDistrict = createSelector(
  orm,
  orm.Tile.district,
  (_, district) =>
    district && {
      ...district,
      buildings: mapValues(district.buildings || {}, ({ id, ...rest }) => ({
        ..._.Building.withId(id)._fields,
        ...rest,
      })),
    },
)

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
    if (!city) return null

    const numPeople = people.length
    const modifiers = getResourceModifiers({ housing, numPeople })
    const drain = { food: FOOD_DRAIN * -numPeople }
    const gain = tiles
      .map((t, i) => ({ ...t, district: districts[i] }))
      .reduce((obj, tile) => sumObjects(obj, getTileResourceChange(tile)), {})
    const subtotal = Object.entries(gain).reduce(
      (_total, [id, value]) => ({ ..._total, [id]: (_total[id] || 0) + value }),
      drain,
    )

    const total = Object.entries(gain).reduce(
      (_total, [id]) => ({
        ..._total,
        [id]: applyResourceModifiers(_total[id] || 0, id, {
          housing,
          numPeople,
        }),
      }),
      { ...subtotal },
    )

    return { gain, drain, subtotal, modifiers, total }
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
const getTileResourceChange = (tile) => {
  let obj = {}
  const tileIsWorked =
    tile.person ||
    typeof tile.personId === 'number' ||
    (tile.district && tile.district.districtTypeId === 'center')
  if (tileIsWorked) {
    getTileEffects(tile).forEach((effect) => {
      Object.entries(effect).forEach(([id, value]) => {
        value = Array.isArray(value) ? sample(value) : value
        obj[id] = (obj[id] || 0) + value
      })
    })
  }

  return obj
}

export const getTileEffects = (tile) => {
  const { district, feature, resource } = tile
  let effects = []
  if (district && district.buildings) {
    effects = effects.concat(
      Object.values(district.buildings)
        .filter((b) => !!b.effects)
        .map((b) => b.effects.resources),
    )
  }

  let tileFeatureEffect = BASE_EFFECTS[feature]
  if (district && district.districtTypeId === 'center') {
    tileFeatureEffect = { resources: { food: 2 } }
  }
  if (tileFeatureEffect) {
    effects = effects.concat(tileFeatureEffect.resources)
  }

  let tileResourceEffect = RESOURCE_EFFECTS[resource]
  if (tileResourceEffect) {
    effects = effects.concat(tileResourceEffect.resources)
  }

  return effects
}

const applyResourceModifiers = (value, id, city) => {
  let base = value * RESOURCE_MULTIPLIER
  if (id === 'food' && value > 0) {
    base *= getResourceModifiers(city).food
  }
  return base
}

export const getResourceModifiers = ({ housing = 0, numPeople = 0 }) => {
  const remainingHousing = housing - numPeople
  let foodModifier = 1
  if (remainingHousing < 2) {
    foodModifier = 0.5
  }
  if (remainingHousing < 1) {
    foodModifier = 0.25
  }
  if (remainingHousing < -4) {
    foodModifier = 0
  }
  return { food: foodModifier }
}

const sumObjects = (one, two) => mergeWith(one, two, (a = 0, b = 0) => a + b)
