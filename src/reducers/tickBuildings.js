import { RESOURCE_MULTIPLIER, FOOD_DRAIN } from '../data'
import { updateResource } from './updateResource'
import { getFirst } from '../selectors'
import { createPerson } from './createPerson'

export const tickBuildings = (sess) => {
  let updates = []

  tickSeats(sess, updates)

  tickPeople(sess, updates)

  tickCities(sess, updates)

  updates.forEach((update) => updateResource(sess, update))

  return sess.state
}

function tickCities(sess, updates) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
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

  sess.Person.all()
    .toModelArray()
    .forEach(({ city }) => {
      updates.push({
        resourceId: 'food',
        cityId: getFirst(city).id,
        value: -FOOD_DRAIN,
      })
    })
}

function tickSeats(sess, updates) {
  sess.Seat.all()
    .toModelArray()
    .forEach((seatModel) => {
      const seat = seatModel.ref
      const building = getFirst(seatModel.buildings)
      const { effects, duration } = sess.Task.withId(seat.taskId).ref
      const cityId = building.city.all().toRefArray()[0].id
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
