export const createSeat = (sess, { districtId, taskId }) => {
  const district = sess.District.withId(districtId)
  const seatInstance = sess.Seat.create({
    progress: 0,
    taskId,
  })
  district.seats.add(seatInstance)
  return sess.state
}
