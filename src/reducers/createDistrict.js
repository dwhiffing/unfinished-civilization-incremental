import { createSeat } from './createSeat'
import { getList } from '../selectors'
export const createDistrict = (sess, payload) => {
  const { cityId, districtTypeId, seatCount, ...district } = payload
  const city = sess.City.withId(cityId)
  const districtInstance = sess.District.create({ districtTypeId, ...district })
  let districtType = getList(sess.DistrictType).find(
    (b) => b.id === districtTypeId,
  )
  districtType.tasks.forEach((task) => {
    let i = seatCount || 1
    while (i-- > 0) {
      createSeat(sess, { districtId: districtInstance.id, taskId: task.id })
    }
  })
  city.districts.add(districtInstance)

  return sess.state
}
