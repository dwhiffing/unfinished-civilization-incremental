import { createAction } from '@reduxjs/toolkit'

export const drag = createAction('DRAG')
export const dragReducer = (sess, { source, destination, draggableId }) => {
  // NICE: add swapping
  if (!destination) {
    return sess.state
  }
  let draggedPerson = sess.Person.all()
    .toModelArray()
    .find((person) => `${person.id}` === draggableId)
  if (source.droppableId === destination.droppableId) {
    let otherPerson = sess.Person.all()
      .toModelArray()
      .find((person) => person._fields.index === destination.index)
    draggedPerson &&
      draggedPerson.update({
        index: destination.index,
      })
    otherPerson && otherPerson.update({ index: source.index })
  } else {
    let foundSeat = sess.Seat.withId(destination.droppableId.split('-')[1])
    if (draggedPerson.seat) {
      let currentSeat = sess.Seat.withId(draggedPerson.seat.id)
      currentSeat.personId = null
    }
    if (foundSeat) {
      foundSeat.update({ personId: draggedPerson.id })
    }
  }
  return sess.state
}
