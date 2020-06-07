export const createSeat = (sess, { buildingId, task }) => {
  const building = sess.Building.withId(buildingId)
  const seatInstance = sess.Seat.create({
    progress: 0,
    taskId: task.id,
  })
  building.seats.add(seatInstance)
  return sess.state
}
