import orm from '../models'
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

  if (action.type === 'INIT') {
    buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
    resources.forEach((resource) =>
      sess.Resource.create({ ...resource, amount: 0 }),
    )
    tasks.forEach((task) => sess.Task.create({ ...task }))
    buildingTypes.forEach(({ ...buildingType }) =>
      sess.BuildingType.create({ ...buildingType }),
    )
    nations.forEach((nation) => createNation(sess, nation))
  }

  if (action.type === 'CREATE_NATION') {
    createNation(sess, action.payload)
  }

  if (action.type === 'CREATE_CITY') {
    createCity({ sess, ...action.payload })
  }

  if (action.type === 'CREATE_SEAT') {
    createSeat(sess, action.payload.buildingId, action.payload.task)
  }

  if (action.type === 'CREATE_PERSON') {
    createPerson(sess, action.payload.cityId, action.payload.person)
  }

  if (action.type === 'UPDATE_RESOURCE') {
    updateResource(
      sess,
      action.payload.resourceId,
      action.payload.amount,
      action.payload.cityId,
      action.payload.nationId,
    )
  }

  if (action.type === 'TICK') {
    tickBuildings(sess)
  }

  if (action.type === 'DRAG' && action.payload.destination) {
    const { source, destination, draggableId } = action.payload
    dragPerson(sess, { source, destination, draggableId })
  }

  return sess.state
}

const createNation = (sess, nation = {}) => {
  const nationInstance = sess.Nation.create({
    ...nation,
    label: faker.address.city(),
  })
  createCity({ sess, nationId: nationInstance.ref.id })
  return sess.state
}

const createCity = ({
  sess,
  nationId,
  label = faker.address.city(),
  people = [{}],
  resources = [],
  buildings = [],
} = {}) => {
  const nation = sess.Nation.withId(nationId)
  const allResources = sess.Resource.all().toModelArray()
  const allBuildings = sess.BuildingType.all().toModelArray()
  const cityInstance = sess.City.create({ label })

  allResources.forEach((resource) => {
    const _resource = resources.find((r) => r.resourceId === resource.ref.id)
    cityInstance.resources.add(
      sess.ResourceStockpile.create({
        resourceId: resource.id,
        amount: _resource ? _resource.amount : 0,
      }),
    )
  })

  people.forEach((person) => createPerson(sess, cityInstance.ref.id, person))
  allBuildings.forEach((building) => {
    const _building = buildings.find((r) => r.buildingId === building.ref.id)
    createBuilding(sess, cityInstance.ref.id, {
      buildingId: building.id,
      ...(_building || {}),
    })
  })

  nation.cities.add(cityInstance)

  return cityInstance
}

const createBuilding = (sess, cityId, building) => {
  const city = sess.City.withId(cityId)
  const buildingInstance = sess.Building.create({ ...building })
  let buildingType = sess.BuildingType.all()
    .toModelArray()
    .find((b) => b.id === building.buildingId)

  buildingInstance.set('buildingType', buildingType)

  buildingType.tasks.forEach((task) => {
    let i = building.seatCount || 1
    while (i-- > 0) {
      createSeat(sess, buildingInstance.id, task)
    }
  })

  city.buildings.add(buildingInstance)

  return buildingInstance
}

const createPerson = (sess, cityId, person) => {
  const city = sess.City.withId(cityId)
  const personInstance = sess.Person.create({
    label: faker.name.firstName(),
    ...person,
  })
  city.people.add(personInstance)
}

const createSeat = (sess, buildingId, task) => {
  const building = sess.Building.withId(buildingId)
  const seatInstance = sess.Seat.create({
    progress: 0,
    task: sess.Task.all()
      .toModelArray()
      .find((t) => t.id === task.id),
  })
  building.seats.add(seatInstance)
}

function updateResource(sess, resourceId, value, cityId, nationId) {
  if (typeof cityId === 'number') {
    let resource = sess.ResourceStockpile.all()
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
      const cities = sess.City.all()
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

const tickBuildings = (sess) => {
  sess.Building.all()
    .toModelArray()
    .forEach((building) => {
      const seats = building.seats.all().toModelArray()
      seats.forEach((seatModel) => {
        const seat = seatModel.ref
        const effect = seat.task._fields.effect
        const cityId = building.city.all().toRefArray()[0].id
        if (seat.progress >= seat.task._fields.duration) {
          updateResource(
            sess,
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
const dragPerson = (sess, { source, destination, draggableId }) => {
  // NICE: add swapping

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
