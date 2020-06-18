import sample from 'lodash/sample'
import mergeWith from 'lodash/mergeWith'
import { BASE_EFFECTS, RESOURCE_EFFECTS } from '../models/Tile'
import { FOOD_DRAIN, RESOURCE_MULTIPLIER } from '../../shared/data'

export const getCityResourceChange = (city) => {
  if (!city) {
    return {}
  }
  const { housing = 1, tiles = [], numPeople = 1 } = city
  const drain = {
    food: FOOD_DRAIN * -numPeople,
  }

  const gain = tiles.reduce((obj, tile) => {
    const change = getTileResourceChange(tile)
    return mergeWith(obj, change, (a = 0, b = 0) => a + b)
  }, {})

  const subtotal = Object.entries(gain).reduce(
    (_total, [id, value]) => {
      _total[id] = (_total[id] || 0) + value
      return _total
    },
    { ...drain },
  )

  const modifiers = getResourceModifiers({ housing, numPeople })

  const total = Object.entries(gain).reduce(
    (_total, [id, value]) => {
      _total[id] = applyResourceModifiers(_total[id] || 0, id, {
        housing,
        numPeople,
      })
      return _total
    },
    { ...subtotal },
  )

  return { gain, drain, subtotal, modifiers, total }
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

export const getTileResourceChange = (tile) => {
  let obj = {}
  if (
    tile.person ||
    (tile.district && tile.district.districtTypeId === 'center')
  ) {
    let tileFeatureEffect = BASE_EFFECTS[tile.feature]
    let tileResourceEffect = RESOURCE_EFFECTS[tile.resource]
    if (tile.district && tile.district.districtTypeId === 'center') {
      tile.feature = null
      tileFeatureEffect = { resources: { food: 2 } }
    }
    if (tileFeatureEffect) {
      Object.entries(tileFeatureEffect.resources).forEach(([id, value]) => {
        value = Array.isArray(value) ? sample(value) : value
        obj[id] = (obj[id] || 0) + value
      })
    }
    if (tileResourceEffect) {
      Object.entries(tileResourceEffect.resources).forEach(([id, value]) => {
        value = Array.isArray(value) ? sample(value) : value
        obj[id] = (obj[id] || 0) + value
      })
    }
  }
  return obj
}
