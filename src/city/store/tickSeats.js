import sample from 'lodash/sample'
import { RESOURCE_MULTIPLIER } from '../../shared/data'
export function tickSeats(sess, updates) {
  // TODO: reduce the number of updates this pushes by combining all similar city id updates
  sess.Seat.all()
    .toModelArray()
    .forEach((seat) => {
      const { effects, duration } = seat.task
      const id = seat.district.city.id
      if (seat.progress >= duration) {
        effects.forEach((effect) => {
          const resourceId = effect.id
          let value = effect.value
          if (Array.isArray(value)) {
            value = sample(value)
          }
          value = value * RESOURCE_MULTIPLIER
          updates.push({ resourceId, value, id })
        })
        return seat.update({ progress: 0 })
      }
      seat.update({
        progress: seat.person ? seat.progress + 1 : seat.progress,
      })
    })
}
