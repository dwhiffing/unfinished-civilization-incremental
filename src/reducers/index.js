import orm from '../orm'
import { resources, tasks, buildingTypes, cities } from '../constants'

const initalState = orm.getEmptyState()

export const reducer = (state = initalState, action) => {
  const sess = orm.session(state)

  const {
    Task,
    Building,
    BuildingType,
    Seat,
    Resource,
    City,
    Person,
    ResourceStockpile,
  } = sess

  if (action.type === 'INIT') {
    resources.forEach((resource) => Resource.create({ ...resource, value: 0 }))
    tasks.forEach((task) => Task.create({ ...task }))
    buildingTypes.forEach(({ ...buildingType }) =>
      BuildingType.create({ ...buildingType }),
    )

    cities.forEach(({ people, buildings, resources, ...city }) => {
      const cityInstance = City.create({ ...city })
      people.forEach((person) => {
        const personInstance = Person.create({ ...person })
        cityInstance.people.add(personInstance)
      })
      resources.forEach((resource) => {
        const resourceInstance = ResourceStockpile.create({ ...resource })
        cityInstance.resources.add(resourceInstance)
      })
      buildings.forEach((building) => {
        const buildingInstance = Building.create({ ...building })
        let buildingType = BuildingType.all()
          .toModelArray()
          .find((b) => b.id === building.buildingId)
        buildingInstance.set('buildingType', buildingType)
        buildingType.tasks.forEach((task) => {
          let i = task.count
          while (i-- > 0) {
            let seat = Seat.create({
              task: Task.all()
                .toModelArray()
                .find((t) => t.id === task.id),
            })
            buildingInstance.seats.add(seat)
          }
        })
        cityInstance.buildings.add(buildingInstance)
      })
    })
  }

  if (action.type === 'FINISH_TASK') {
    let resource = ResourceStockpile.all()
      .toModelArray()
      .find((r) => {
        return (
          r.resourceId === action.payload.resourceId &&
          r.city
            .all()
            .toRefArray()
            .some((c) => c.id === action.payload.cityId)
        )
      })

    resource &&
      resource.update({ amount: resource.ref.amount + action.payload.value })
  }

  if (action.type === 'DRAG' && action.payload.destination) {
    // TODO: add swapping
    const { source, destination, draggableId } = action.payload

    let draggedPerson = Person.all()
      .toModelArray()
      .find((person) => `${person.id}` === draggableId)

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
