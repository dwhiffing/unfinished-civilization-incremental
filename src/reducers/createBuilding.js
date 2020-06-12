import { createSeat } from './createSeat'
import { getList } from '../selectors'
export const createBuilding = (sess, payload) => {
  const { cityId, buildingTypeId, seatCount, ...building } = payload
  const city = sess.City.withId(cityId)
  const buildingInstance = sess.Building.create({ buildingTypeId, ...building })
  let buildingType = getList(sess.BuildingType).find(
    (b) => b.id === buildingTypeId,
  )
  buildingType.tasks.forEach((task) => {
    let i = seatCount || 1
    while (i-- > 0) {
      createSeat(sess, { buildingId: buildingInstance.id, taskId: task.id })
    }
  })
  city.buildings.add(buildingInstance)

  return sess.state
}
