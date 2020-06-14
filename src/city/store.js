import faker from 'faker'
import { CITY_NAMES } from './data'
import { RESOURCE_MULTIPLIER, getUniqueName } from '../shared/data'
import { createAction } from '@reduxjs/toolkit'
import { getFirst, getList } from '../shared/selectors'
import { FOOD_DRAIN } from '../shared/data'

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

// TODO: move to feature directory
export function tickCities(sess, updates) {
  getList(sess.City).forEach((city) => {
    const pop = city.people.all().toRefArray().length
    const growth = city.resources
      .all()
      .toRefArray()
      .find((r) => r.resourceId === 'growth')
    if (pop < city.housing) {
      updates.push({
        resourceId: 'growth',
        cityId: city.id,
        value: 1,
      })
      if (growth && growth.amount >= 5) {
        createPersonReducer(sess, { cityId: city.id })
        updates.push({
          resourceId: 'growth',
          cityId: city.id,
          value: -5,
        })
      }
    }
  })
}

export function tickSeats(sess, updates) {
  getList(sess.Seat).forEach((seatModel) => {
    const seat = seatModel.ref
    const district = getFirst(seatModel.districts)
    const { effects, duration } = sess.Task.withId(seat.taskId).ref
    const cityId = district.city.all().toRefArray()[0].id
    if (seat.progress >= duration) {
      effects.forEach((effect) => {
        const resourceId = effect.id
        let value = effect.value
        if (typeof value === 'function') {
          value = value()
        }
        value = value * RESOURCE_MULTIPLIER
        updates.push({ resourceId, value, cityId })
      })
      return seatModel.update({ progress: 0 })
    }
    seatModel.update({
      progress: seat.person ? seat.progress + 1 : seat.progress,
    })
  })
}

export function tickPeople(sess, updates) {
  //TODO: this should reduce to array of cities being updated
  getList(sess.Person).forEach(({ city }) => {
    updates.push({
      resourceId: 'food',
      cityId: getFirst(city).id,
      value: -FOOD_DRAIN,
    })
  })
}
