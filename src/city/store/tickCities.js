import sample from 'lodash/sample'
import { createPersonReducer } from './createPerson'
import { FOOD_DRAIN, RESOURCE_MULTIPLIER } from '../../shared/data'
import { updateResourceReducer as updateResource } from '../../shared/store/updateResource'

export function tickCities(sess) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      cityFoodDrain(sess, city)
      cityGrowth(sess, city)
      citySeats(sess, city)
    })
}

function cityFoodDrain(sess, { id, people }) {
  const totalDrain = FOOD_DRAIN * -people.all().toModelArray().length
  updateResource(sess, { resourceId: 'food', id, value: totalDrain })
}

function cityGrowth(sess, { id, people, housing, stockpiles }) {
  if (people.count() < housing) {
    updateResource(sess, { resourceId: 'growth', id, value: 1 })
    const growth = stockpiles.filter({ resourceId: 'growth' }).first()
    if (growth && growth.amount >= 5) {
      createPersonReducer(sess, { cityId: id })
      updateResource(sess, { resourceId: 'growth', id, value: -5 })
    }
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
      obj[id] = (obj[id] || 0) + value * RESOURCE_MULTIPLIER
    })
    return obj
  }, {})

  Object.entries(totalledEffects).forEach(([resourceId, value]) => {
    updateResource(sess, { resourceId, id: city.id, value })
  })
}
