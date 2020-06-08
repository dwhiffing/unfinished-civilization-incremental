export const createSeat = (sess, { buildingId, taskId }) => {
  const building = sess.Building.withId(buildingId)
  const seatInstance = sess.Seat.create({
    progress: 0,
    taskId,
  })
  building.seats.add(seatInstance)
  return sess.state
}
