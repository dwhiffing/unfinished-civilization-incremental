import orm from '../orm'
import {
  resources,
  tasks,
  buildingTypes,
  nations,
  buyables,
  RESOURCE_MULTIPLIER,
} from '../constants'
import faker from 'faker'
import clamp from 'lodash/clamp'
const initalState = orm.getEmptyState()

export const reducer = (state = initalState, action) => {
  const sess = orm.session(state)

  const {
    Task,
    Building,
    BuildingType,
    Buyable,
    Seat,
    Resource,
    City,
    Person,
    ResourceStockpile,
    Nation,
  } = sess

  const createNation = (nation = {}) => {
    const nationInstance = Nation.create({
      ...nation,
      label: faker.address.city(),
    })
    createCity({ nationId: nationInstance.ref.id })
  }

  const createCity = ({
    nationId,
    label = faker.address.city(),
    people = [{}],
    resources = [],
    buildings = [],
  } = {}) => {
    const nation = Nation.withId(nationId)
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

    nation.cities.add(cityInstance)

    return cityInstance
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
    const personInstance = Person.create({
      label: faker.name.firstName(),
      ...person,
    })
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
    buyables.forEach((buyable) => Buyable.create({ ...buyable }))
    resources.forEach((resource) => Resource.create({ ...resource, amount: 0 }))
    tasks.forEach((task) => Task.create({ ...task }))
    buildingTypes.forEach(({ ...buildingType }) =>
      BuildingType.create({ ...buildingType }),
    )
    nations.forEach(createNation)
  }

  if (action.type === 'CREATE_NATION') {
    createNation(action.payload)
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

  if (action.type === 'UPDATE_RESOURCE') {
    updateResource(
      ResourceStockpile,
      City,
      action.payload.resourceId,
      action.payload.amount,
      action.payload.cityId,
      action.payload.nationId,
    )
  }

  if (action.type === 'TICK') {
    Building.all()
      .toModelArray()
      .forEach((building) => {
        const seats = building.seats.all().toModelArray()
        seats.forEach((seatModel) => {
          const seat = seatModel.ref
          const effect = seat.task._fields.effect
          const cityId = building.city.all().toRefArray()[0].id
          if (seat.progress >= seat.task._fields.duration) {
            updateResource(
              ResourceStockpile,
              City,
              effect.id,
              effect.value * RESOURCE_MULTIPLIER,
              cityId,
            )
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
    // NICE: add swapping
    const { source, destination, draggableId } = action.payload

    let draggedPerson = Person.all()
      .toModelArray()
      .find((person) => `${person.id}` === draggableId)

    if (source.droppableId === destination.droppableId) {
      let otherPerson = Person.all()
        .toModelArray()
        .find((person) => person._fields.index === destination.index)
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

function updateResource(
  ResourceStockpile,
  City,
  resourceId,
  value,
  cityId,
  nationId,
) {
  if (typeof cityId === 'number') {
    let resource = ResourceStockpile.all()
      .toModelArray()
      .find((r) => {
        return (
          r.resourceId === resourceId &&
          r.city
            .all()
            .toRefArray()
            .some((c) => c.id === cityId)
        )
      })
    if (resource && resource.ref.amount + value >= 0) {
      resource.update({
        amount: resource.ref.amount + value,
      })
      return resource
    }
  } else {
    let amountToConsume = Math.abs(value)

    while (amountToConsume > 0) {
      const cities = City.all()
        .toModelArray()
        .filter((c) =>
          nationId ? c.nation.all().toRefArray()[0].id === +nationId : true,
        )
      const validResources = cities
        .map((city) => {
          const resource = city.resources
            .all()
            .toModelArray()
            .find((r) => r.ref.resourceId === resourceId && r.ref.amount > 0)
          return resource
        })
        .filter((t) => !!t)
      const resource = validResources[0]
      if (resource) {
        let amt = resource.ref.amount
        resource.update({
          amount:
            resource.ref.amount -
            clamp(amountToConsume, 0, resource.ref.amount),
        })
        amountToConsume -= amt
      } else {
        break
      }
    }
  }

  return false
}
