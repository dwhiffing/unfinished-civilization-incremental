import { createSeat } from './createSeat'
export const createBuilding = (sess, { cityId, building }) => {
  const city = sess.City.withId(cityId)
  const buildingInstance = sess.Building.create({ ...building })
  let buildingType = sess.BuildingType.all()
    .toModelArray()
    .find((b) => b.id === building.buildingId)
  buildingInstance.set('buildingType', buildingType)
  buildingType.tasks.forEach((task) => {
    let i = building.seatCount || 1
    while (i-- > 0) {
      createSeat(sess, { buildingId: buildingInstance.id, taskId: task.id })
    }
  })
  city.buildings.add(buildingInstance)

  return sess.state
}
