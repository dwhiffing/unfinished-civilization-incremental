import orm from '../orm'
import { resources, people, tasks, buildings } from '../constants'

const initalState = orm.getEmptyState()

export const reducer = (state = initalState, action) => {
  const sess = orm.session(state)

  const { Task, Building, Seat, Resource, Person } = sess

  if (action.type === 'INIT') {
    resources.forEach((resource) => Resource.create({ ...resource, value: 0 }))
    people.forEach((person) => Person.create({ ...person }))
    tasks.forEach((task) => Task.create({ ...task }))
    buildings.forEach(({ tasks, ...building }) => {
      const _building = Building.create({ ...building })
      tasks.forEach((task) => {
        let i = task.count
        while (i-- > 0) {
          let seat = Seat.create({
            task: Task.all()
              .toModelArray()
              .find((t) => t.id === task.id),
          })
          _building.seats.add(seat)
        }
      })
    })
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
      .find((person) => person.id === draggableId)

    if (source.droppableId === destination.droppableId) {
      let otherPerson = Person.all()
        .toModelArray()
        .find((person) => person.ref.index === destination.index)
      draggedPerson &&
        draggedPerson.update({
          index: destination.index,
        })
      otherPerson && otherPerson.update({ index: source.index })
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
