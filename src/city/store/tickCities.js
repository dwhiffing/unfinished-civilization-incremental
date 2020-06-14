import sample from 'lodash/sample'
import compact from 'lodash/compact'
import { createPersonReducer } from './createPerson'
import { FOOD_DRAIN, RESOURCE_MULTIPLIER } from '../../shared/data'

export function tickCities(sess, updates) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      // Food drain
      const totalDrain = FOOD_DRAIN * -city.people.all().toModelArray().length
      updates.push({ resourceId: 'food', id: city.id, value: totalDrain })

      // citizen growth
      if (city.people.count() < city.housing) {
        updates.push({ resourceId: 'growth', id: city.id, value: 1 })
        const growth = city.stockpiles.filter({ resourceId: 'growth' }).first()
        if (growth && growth.amount >= 5) {
          createPersonReducer(sess, { cityId: city.id })
          updates.push({ resourceId: 'growth', id: city.id, value: -5 })
        }
      }

      const citySeats = city.districts
        .all()
        .toModelArray()
        .map((d) => d.seats.all().toModelArray())
        .flat()

      const completedSeats = citySeats
        .filter((s) => !!s.person)
        .filter((seat) => {
          const complete = seat.progress >= seat.task.duration
          seat.update({ progress: complete ? 0 : seat.progress + 1 })
          return complete
        })

      // seat productivity
      const completedEffects = completedSeats.reduce(
        (arr, seat) =>
          arr.concat(
            seat.task.effects.map(({ id, value }) => {
              value = Array.isArray(value) ? sample(value) : value
              value = value * RESOURCE_MULTIPLIER
              return { resourceId: id, value }
            }),
          ),
        [],
      )

      const reduced = completedEffects.reduce((sum, n) => {
        sum[n.resourceId] = sum[n.resourceId] || 0
        sum[n.resourceId] += n.value
        return sum
      }, {})

      console.log({ completedEffects, reduced })

      Object.entries(reduced).forEach(([resourceId, value]) =>
        updates.push({ resourceId, value, id: city.id }),
      )
    })
}
