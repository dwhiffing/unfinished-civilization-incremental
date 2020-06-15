import { createAction } from '@reduxjs/toolkit'

export const createSeat = createAction('CREATE_SEAT')
export const createSeatReducer = (sess, { districtId, taskId }) => {
  sess.Seat.create({ progress: 0, taskId, districtId })
  return sess.state
}
