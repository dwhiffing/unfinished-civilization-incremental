import sample from 'lodash/sample'
import { createPersonReducer } from './createPerson'
import { FOOD_DRAIN, RESOURCE_MULTIPLIER } from '../../shared/data'
import { updateResourceReducer as updateResource } from '../../shared/store/updateResource'

export function tickCities(sess) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      cityGrowth(sess, city)
      cityFoodDrain(sess, city)
      citySeats(sess, city)
    })
}

function cityFoodDrain(sess, { id, people }) {
  const totalDrain = FOOD_DRAIN * -people.count()
  updateResource(sess, { resourceId: 'food', id, value: totalDrain })
}

function cityGrowth(sess, { id, people, housing, stockpiles }) {
  const food = stockpiles.filter({ resourceId: 'food' }).first()
  if (food.amount >= food.limit) {
    updateResource(sess, { resourceId: 'food', id, value: food.limit * -0.9 })
    createPersonReducer(sess, { cityId: id })
  }
}

function citySeats(sess, city) {
  const cityDistricts = city.districts.all().toModelArray()
  const citySeats = cityDistricts.map((d) => d.seats.all().toModelArray())
  const completedSeats = citySeats.flat().filter((seat) => {
    const complete = seat.progress >= seat.task.duration
    seat.progress = complete ? 0 : seat.progress + (seat.person ? 1 : 0)
    return complete
  })

  const totalledEffects = completedSeats.reduce((obj, seat) => {
    seat.task.effects.forEach(({ id, value }) => {
      value = Array.isArray(value) ? sample(value) : value
      obj[id] = (obj[id] || 0) + applyResourceModifiers(value, id, city)
    })
    return obj
  }, {})

  Object.entries(totalledEffects).forEach(([resourceId, value]) => {
    updateResource(sess, { resourceId, id: city.id, value })
  })
}

const applyResourceModifiers = (value, id, city) => {
  let base = value * RESOURCE_MULTIPLIER
  if (id === 'food') {
    const { housing, people } = city
    const remainingHousing = housing - people.count()
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
    base *= foodModifier
  }
  return base
}

const FOOD_MODIFIERS = [1, 0.5, 0.25, 0]
