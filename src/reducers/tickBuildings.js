import { RESOURCE_MULTIPLIER } from '../data'
import { updateResource } from './updateResource'
export const tickBuildings = (sess) => {
  sess.Building.all()
    .toModelArray()
    .forEach((building) => {
      const seats = building.seats.all().toModelArray()
      seats.forEach((seatModel) => {
        const seat = seatModel.ref
        const task = sess.Task.withId(seat.taskId)
        const { effects, duration } = task.ref
        if (!effects) debugger
        const cityId = building.city.all().toRefArray()[0].id
        if (seat.progress >= duration) {
          effects.forEach((effect) => {
            const resourceId = effect.id
            const value = effect.value * RESOURCE_MULTIPLIER
            updateResource(sess, { resourceId, value, cityId })
          })
          seatModel.update({ progress: 0 })
          return
        }
        seatModel.update({
          progress: seat.person ? seat.progress + 1 : seat.progress,
        })
      })
    })
  return sess.state
}
