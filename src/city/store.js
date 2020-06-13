import faker from 'faker'
import { CITY_NAMES } from './data'
import { getUniqueName, RESOURCE_MULTIPLIER } from '../data'
import { createAction } from '@reduxjs/toolkit'
import { getFirst, getList } from '../shared/selectors'

export const createCity = createAction('CREATE_CITY')
export const createCityReducer = (sess, payload) => {
  const {
    plotId,
    label = getUniqueName(sess.City, CITY_NAMES),
    people = [{}],
  } = payload

  const plot = sess.Plot.withId(plotId)
  const allResources = sess.Resource.all().toModelArray()
  const continent = getFirst(plot.continent)
  const planet = getFirst(continent.planet)
  const system = getFirst(planet.system)
  const cityInstance = sess.City.create({
    label,
    housing: 5,
    continentId: continent.id,
    planetId: planet.id,
    systemId: system.id,
  })
  const cityId = cityInstance.ref.id

  allResources.forEach(({ id }) => {
    const _resource = sess.Resource.withId(id)
    const amount = _resource ? _resource.ref.amount : 0
    const _limit = _resource ? _resource.ref.limit : 100
    const limit = _limit * RESOURCE_MULTIPLIER
    cityInstance.resources.add(
      sess.ResourceStockpile.create({ resourceId: id, amount, limit }),
    )
  })
  people.forEach((person) => createPersonReducer(sess, { cityId, person }))
  createDistrictReducer(sess, { cityId, districtTypeId: 'center' })

  plot.update({ explored: true })
  continent.update({ explored: true })
  planet.update({ explored: true })
  system.update({ explored: true })
  plot.cities.add(cityInstance)

  return sess.state
}

export const createDistrict = createAction('CREATE_BUILDING')
export const createDistrictReducer = (sess, payload) => {
  const { cityId, districtTypeId, seatCount, ...district } = payload
  const city = sess.City.withId(cityId)
  const districtInstance = sess.District.create({ districtTypeId, ...district })
  let districtType = getList(sess.DistrictType).find(
    (b) => b.id === districtTypeId,
  )
  districtType.tasks.forEach((task) => {
    let i = seatCount || 1
    while (i-- > 0) {
      createSeatReducer(sess, {
        districtId: districtInstance.id,
        taskId: task.id,
      })
    }
  })
  city.districts.add(districtInstance)

  return sess.state
}

export const createSeat = createAction('CREATE_SEAT')
export const createSeatReducer = (sess, { districtId, taskId }) => {
  const district = sess.District.withId(districtId)
  const seatInstance = sess.Seat.create({
    progress: 0,
    taskId,
  })
  district.seats.add(seatInstance)
  return sess.state
}

export const createPerson = createAction('CREATE_PERSON')
export const createPersonReducer = (sess, { cityId, person }) => {
  const city = sess.City.withId(cityId)
  const personInstance = sess.Person.create({
    label: faker.name.firstName(),
    ...person,
  })
  city.people.add(personInstance)
  return sess.state
}

export const drag = createAction('DRAG')
export const dragReducer = (sess, { source, destination, draggableId }) => {
  // NICE: add swapping
  if (!destination) {
    return sess.state
  }
  let draggedPerson = getList(sess.Person).find(
    (person) => `${person.id}` === draggableId,
  )
  if (source.droppableId === destination.droppableId) {
    let otherPerson = getList(sess.Person).find(
      (person) => person._fields.index === destination.index,
    )
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
  return sess.state
}
