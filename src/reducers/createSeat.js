export const createSeat = (sess, { buildingId, task }) => {
  const building = sess.Building.withId(buildingId)
  const seatInstance = sess.Seat.create({
    progress: 0,
    task: sess.Task.all()
      .toModelArray()
      .find((t) => t.id === task.id),
  })
  building.seats.add(seatInstance)
  return sess.state
}
