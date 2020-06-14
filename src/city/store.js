import faker from 'faker'
import sample from 'lodash/sample'
import { CITY_NAMES } from './data'
import { RESOURCE_MULTIPLIER, getUniqueName } from '../shared/data'
import { createAction } from '@reduxjs/toolkit'
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
  const cityInstance = sess.City.create({
    label,
    housing: 5,
    continentId: plot.continent.id,
    planetId: plot.continent.planet.id,
    systemId: plot.continent.planet.system.id,
  })
  const cityId = cityInstance.ref.id

  allResources.forEach(({ id }) => {
    const _resource = sess.Resource.withId(id)
    const amount = _resource ? _resource.ref.amount : 0
    const _limit = _resource ? _resource.ref.limit : 100
    const limit = _limit * RESOURCE_MULTIPLIER
    sess.ResourceStockpile.create({ resourceId: id, amount, limit, cityId })
  })
  people.forEach((person) => createPersonReducer(sess, { cityId, person }))
  createDistrictReducer(sess, { cityId, districtTypeId: 'center' })

  plot.update({ explored: true, cityId })
  plot.continent.update({ explored: true })
  plot.continent.planet.update({ explored: true })
  plot.continent.planet.system.update({ explored: true })

  return sess.state
}

export const createDistrict = createAction('CREATE_BUILDING')
export const createDistrictReducer = (sess, payload) => {
  const { cityId, districtTypeId, seatCount, ...district } = payload
  const districtInstance = sess.District.create({
    districtTypeId,
    cityId,
    ...district,
  })
  let districtType = sess.DistrictType.all()
    .toModelArray()
    .find((b) => b.id === districtTypeId)
  districtType.tasks.forEach((task) => {
    let i = seatCount || 1
    while (i-- > 0) {
      createSeatReducer(sess, {
        districtId: districtInstance.id,
        taskId: task.id,
      })
    }
  })

  return sess.state
}

export const createSeat = createAction('CREATE_SEAT')
export const createSeatReducer = (sess, { districtId, taskId }) => {
  sess.Seat.create({ progress: 0, taskId, districtId })
  return sess.state
}

export const createPerson = createAction('CREATE_PERSON')
export const createPersonReducer = (sess, { cityId, person }) => {
  sess.Person.create({ label: faker.name.firstName(), ...person, cityId })
  return sess.state
}

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
    let foundSeat = sess.Seat.withId(destination.droppableId.split('-')[1])
    if (draggedPerson.seat) {
      let currentSeat = sess.Seat.withId(draggedPerson.seat.id)
      currentSeat.personId = null
    }
    if (foundSeat) {
      foundSeat.update({ personId: draggedPerson.id })
    }
  }
  return sess.state
}

export function tickCities(sess, updates) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      const pop = city.people.all().toRefArray().length
      const growth = city.stockpiles
        .all()
        .toRefArray()
        .find((s) => s.resourceId === 'growth')
      if (pop < city.housing) {
        updates.push({
          resourceId: 'growth',
          id: city.id,
          value: 1,
        })
        if (growth && growth.amount >= 5) {
          createPersonReducer(sess, { cityId: city.id })
          updates.push({
            resourceId: 'growth',
            id: city.id,
            value: -5,
          })
        }
      }
    })
}

export function tickSeats(sess, updates) {
  // TODO: reduce the number of updates this pushes by combining all similar city id updates
  sess.Seat.all()
    .toModelArray()
    .forEach((seat) => {
      const { effects, duration } = seat.task
      const id = seat.district.city.id
      if (seat.progress >= duration) {
        effects.forEach((effect) => {
          const resourceId = effect.id
          let value = effect.value
          if (Array.isArray(value)) {
            value = sample(value)
          }
          value = value * RESOURCE_MULTIPLIER
          updates.push({ resourceId, value, id })
        })
        return seat.update({ progress: 0 })
      }
      seat.update({
        progress: seat.person ? seat.progress + 1 : seat.progress,
      })
    })
}

export function tickPeople(sess, updates) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      updates.push({
        resourceId: 'food',
        id: city.id,
        value: FOOD_DRAIN * -city.people.all().toModelArray().length,
      })
    })
}
