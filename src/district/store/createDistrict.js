import { createSeatReducer } from './createSeat'
import { createAction } from '@reduxjs/toolkit'

export const createDistrict = createAction('CREATE_BUILDING')
export const createDistrictReducer = (sess, payload) => {
  const { cityId, districtTypeId, seatCount, ...district } = payload
  const districtInstance = sess.District.create({
    districtTypeId,
    cityId,
    ...district,
  })
  let districtType = sess.DistrictType.all()
    .toModelArray()
    .find((b) => b.id === districtTypeId)
  districtType.tasks.forEach((task) => {
    let i = seatCount || 1
    while (i-- > 0) {
      createSeatReducer(sess, {
        districtId: districtInstance.id,
        taskId: task.id,
      })
    }
  })

  return sess.state
}
