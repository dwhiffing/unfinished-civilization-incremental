import { RESOURCE_MULTIPLIER, FOOD_DRAIN } from '../data'
import { updateResource } from './updateResource'
import { getFirst, getList } from '../shared/selectors'
import { createPerson } from './createPerson'

export const applyTickEffects = (sess) => {
  let updates = []
  tickPeople(sess, updates)

  tickSeats(sess, updates)

  tickCities(sess, updates)

  updates.forEach((update) => updateResource(sess, update))

  return sess.state
}

function tickCities(sess, updates) {
  getList(sess.City).forEach((city) => {
    const pop = city.people.all().toRefArray().length
    const growth = city.resources
      .all()
      .toRefArray()
      .find((r) => r.resourceId === 'growth')
    if (pop < city.housing) {
      updates.push({
        resourceId: 'growth',
        cityId: city.id,
        value: 1,
      })
      if (growth && growth.amount >= 5) {
        createPerson(sess, { cityId: city.id })
        updates.push({
          resourceId: 'growth',
          cityId: city.id,
          value: -5,
        })
      }
    }
  })
}

function tickPeople(sess, updates) {
  //TODO: this should reduce to array of cities being updated

  getList(sess.Person).forEach(({ city }) => {
    updates.push({
      resourceId: 'food',
      cityId: getFirst(city).id,
      value: -FOOD_DRAIN,
    })
  })
}

function tickSeats(sess, updates) {
  getList(sess.Seat).forEach((seatModel) => {
    const seat = seatModel.ref
    const district = getFirst(seatModel.districts)
    const { effects, duration } = sess.Task.withId(seat.taskId).ref
    const cityId = district.city.all().toRefArray()[0].id
    if (seat.progress >= duration) {
      effects.forEach((effect) => {
        const resourceId = effect.id
        let value = effect.value
        if (typeof value === 'function') {
          value = value()
        }
        value = value * RESOURCE_MULTIPLIER
        updates.push({ resourceId, value, cityId })
      })
      return seatModel.update({ progress: 0 })
    }
    seatModel.update({
      progress: seat.person ? seat.progress + 1 : seat.progress,
    })
  })
}
