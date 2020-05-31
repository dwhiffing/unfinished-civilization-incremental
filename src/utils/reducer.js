import orm from './orm'

const initalState = orm.getEmptyState()

export const reducer = (state = initalState, action) => {
  const sess = orm.session(state)

  const { Task, Building, Seat, Resource, Person } = sess

  if (action.type === 'INIT') {
    Resource.create({ label: 'food', value: 0 })
    Person.create({ label: 'dan', index: 0 })
    Person.create({ label: 'nad', index: 1 })
    let task = Task.create({
      label: 'scavenge',
      duration: 30,
      effect: { label: 'food', value: 1 },
    })
    let building = Building.create({ label: 'camp' })
    let seat = Seat.create({ task })
    building.seats.add(seat)
    let seat2 = Seat.create({ task })
    building.seats.add(seat2)
  }

  if (action.type === 'FINISH_TASK') {
    let resource = Resource.withId(action.payload.resourceId)
    resource.update({ value: resource.ref.value + action.payload.value })
  }

  if (action.type === 'DRAG' && action.payload.destination) {
    // TODO: add swapping
    const { source, destination, draggableId } = action.payload

    let draggedPerson = Person.all()
      .toModelArray()
      .find((person) => person.label === draggableId)

    if (source.droppableId === destination.droppableId) {
      let otherPerson = Person.all()
        .toModelArray()
        .find((person) => person.ref.index === destination.index)
      draggedPerson.update({
        index: destination.index,
      })
      otherPerson.update({ index: source.index })
    } else {
      let foundSeat = Seat.withId(destination.droppableId.split('-')[1])

      if (draggedPerson.seat) {
        let currentSeat = Seat.withId(draggedPerson.seat.id)
        currentSeat.update({ person: undefined })
      }

      if (foundSeat) {
        draggedPerson.update({ seat: foundSeat })
        foundSeat.update({ person: draggedPerson })
      } else {
        draggedPerson.update({ seat: undefined })
      }
    }
  }

  return sess.state
}
