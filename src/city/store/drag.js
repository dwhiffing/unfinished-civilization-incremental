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
    let foundTille = sess.Tile.withId(destination.droppableId.split('-')[1])
    if (draggedPerson.tile) {
      let currentTile = sess.Tile.withId(draggedPerson.tile.id)
      currentTile.personId = null
    }
    if (foundTille) {
      foundTille.update({ personId: draggedPerson.id })
    }
  }
  return sess.state
}
