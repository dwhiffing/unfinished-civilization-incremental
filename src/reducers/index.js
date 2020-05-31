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

  const createCity = ({
    label = 'city',
    people = [{ label: 'dan' }],
    resources = [],
    buildings = [],
  } = {}) => {
    const allResources = Resource.all().toModelArray()
    const allBuildings = BuildingType.all().toModelArray()
    const cityInstance = City.create({ label })

    allResources.forEach((resource) => {
      const _resource = resources.find((r) => r.resourceId === resource.ref.id)
      cityInstance.resources.add(
        ResourceStockpile.create({
          resourceId: resource.id,
          amount: _resource ? _resource.amount : 0,
        }),
      )
    })

    people.forEach((person) => createPerson(cityInstance.ref.id, person))
    allBuildings.forEach((building) => {
      const _building = buildings.find((r) => r.buildingId === building.ref.id)
      createBuilding(cityInstance.ref.id, {
        buildingId: building.id,
        ...(_building || {}),
      })
    })
  }

  const createBuilding = (cityId, building) => {
    const city = City.withId(cityId)
    const buildingInstance = Building.create({ ...building })
    let buildingType = BuildingType.all()
      .toModelArray()
      .find((b) => b.id === building.buildingId)

    buildingInstance.set('buildingType', buildingType)

    buildingType.tasks.forEach((task) => {
      let i = building.seatCount || 1
      while (i-- > 0) {
        createSeat(buildingInstance.id, task)
      }
    })

    city.buildings.add(buildingInstance)

    return buildingInstance
  }

  const createPerson = (cityId, person) => {
    const city = City.withId(cityId)
    const personInstance = Person.create({ ...person })
    city.people.add(personInstance)
  }

  const createSeat = (buildingId, task) => {
    const building = Building.withId(buildingId)
    const seatInstance = Seat.create({
      progress: 0,
      task: Task.all()
        .toModelArray()
        .find((t) => t.id === task.id),
    })
    building.seats.add(seatInstance)
  }

  if (action.type === 'INIT') {
    resources.forEach((resource) => Resource.create({ ...resource, amount: 0 }))
    tasks.forEach((task) => Task.create({ ...task }))
    buildingTypes.forEach(({ ...buildingType }) =>
      BuildingType.create({ ...buildingType }),
    )
    cities.forEach(createCity)
  }

  if (action.type === 'CREATE_CITY') {
    createCity(action.payload)
  }

  if (action.type === 'CREATE_SEAT') {
    createSeat(action.payload.buildingId, action.payload.task)
  }

  if (action.type === 'CREATE_PERSON') {
    createPerson(action.payload.cityId, action.payload.person)
  }

  if (action.type === 'TICK') {
    Building.all()
      .toModelArray()
      .forEach((building) => {
        const seats = building.seats.all().toModelArray()
        seats.forEach((seatModel) => {
          const seat = seatModel.ref
          const effect = seat.task.ref.effect
          const cityId = building.city.all().toRefArray()[0].id
          if (seat.progress >= seat.task.ref.duration) {
            let resource = ResourceStockpile.all()
              .toModelArray()
              .find((r) => {
                return (
                  r.resourceId === effect.id &&
                  r.city
                    .all()
                    .toRefArray()
                    .some((c) => c.id === cityId)
                )
              })
            resource &&
              resource.update({
                amount: resource.ref.amount + effect.value,
              })
            seatModel.update({ progress: 0 })
            return
          }

          seatModel.update({
            progress: seat.person ? seat.progress + 1 : seat.progress,
          })
        })
      })
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
