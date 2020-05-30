import orm from './orm'
import get from 'lodash/get'
import set from 'lodash/set'

const initalState = orm.getEmptyState()

export const reducer = (state = initalState, action) => {
  const sess = orm.session(state)

  const { Task, Building, Seat, Resource, Person } = sess

  // eslint-disable-next-line
  switch (action.type) {
    case 'INIT':
      Resource.create({ label: 'food', value: 0 })
      Person.create({ label: 'dan', index: 0 })
      Person.create({ label: 'nad', index: 1 })
      let task = Task.create({
        label: 'scavenge',
        duration: 1,
        effect: { label: 'food', value: 1 },
      })
      let seat = Seat.create({ task })
      let seat2 = Seat.create({ task })
      let building = Building.create({ label: 'camp' })
      building.seats.add(seat)
      building.seats.add(seat2)
      break
    case 'FINISH_TASK':
      let resource = Resource.withId(action.payload.resourceId)
      resource.update({ value: resource.ref.value + action.payload.value })
      break
    case 'DRAG':
      // TODO: add swapping
      const { source, destination, draggableId } = action.payload
      if (!destination) {
        break
      }
      let draggedPerson = Person.all()
        .toModelArray()
        .find((person) => person.label === draggableId)

      if (source.droppableId === destination.droppableId) {
        let otherPerson = Person.all()
          .toModelArray()
          .find((person) => person.ref.index === destination.index)
        draggedPerson.update({ index: destination.index })
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
      break
    // case 'CREATE_BUILDING':
    //   Building.create(action.payload)
    //   break
    // case 'UPDATE_BUILDING':
    //   building = Building.withId(action.payload.id)
    //   building.update(action.payload)
    //   break
    // case 'REMOVE_BUILDING':
    //   building = Building.withId(action.payload)
    //   building.delete()
    //   break
    // case 'ADD_TASK_TO_BUILDING':
    //   building = Building.withId(action.payload.buildingId)
    //   building.tasks.add(action.payload.task)
    //   break
  }

  return sess.state
}
