import { createAction } from '@reduxjs/toolkit'
import { createCityReducer } from '../city/store'
import { getFirst, getFirstDeep } from './selectors'
import { getList } from './selectors'
import { tickCities, tickPeople, tickSeats } from '../city/store'
import random from 'lodash/random'
import times from 'lodash/times'
import { tasks } from '../city/data'
import {
  SYSTEM_COUNT_RANGE,
  UNLOCK_ALL,
  resources,
  buyables,
  UNLOCKS,
} from './data'
import { districtTypes } from '../city/data'
import { createSystem } from '../system/store'
import clamp from 'lodash/clamp'
import { getCitiesByIds } from '../city/selectors'

export const createInitial = createAction('INIT')
export const createInitialReducer = (sess) => {
  buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
  resources.forEach((resource) =>
    sess.Resource.create({ ...resource, amount: 0 }),
  )
  tasks.forEach((task) => sess.Task.create({ ...task }))
  districtTypes.forEach(({ ...districtType }) =>
    sess.DistrictType.create({ ...districtType }),
  )

  if (sess.System.all().toRefArray().length === 0) {
    times(random(...SYSTEM_COUNT_RANGE), () => createSystem(sess, {}))
    createCityReducer(sess, { plotId: getFirst(sess.Plot).id })
    unlockReducer(sess, 'center')
    updateResourceReducer(sess, { resourceId: 'food', cityId: 0, value: 100 })

    if (UNLOCK_ALL) {
      UNLOCKS.forEach((id) => unlockReducer(sess, id))
    }
  }

  return sess.state
}

const BLACKLIST = ['growth']
export const unlock = createAction('UNLOCK')
export const unlockReducer = (sess, payload = {}) => {
  if (!sess.Unlock.withId(payload) && !BLACKLIST.includes(payload)) {
    sess.Unlock.create({ id: payload })
  }
  return sess.state
}

export const tick = createAction('TICK')
export const applyTickEffectsReducer = (sess) => {
  let updates = []
  tickPeople(sess, updates)
  tickSeats(sess, updates)
  tickCities(sess, updates)

  updates.forEach((update) => updateResourceReducer(sess, update))

  return sess.state
}

export const updateResource = createAction('UPDATE_RESOURCE')
export function updateResourceReducer(sess, { resourceId: id, value, ...ids }) {
  if (value === 0) return sess.state

  unlockReducer(sess, id)

  let remaining = value
  getCitiesByIds(sess, { ...ids }).forEach((city) => {
    const resource = getList(city.resources).find(
      ({ ref }) => ref.resourceId === id,
    )
    let { amount, limit } = resource.ref
    const newAmount = clamp(amount + remaining, 0, limit)
    remaining = amount + remaining - newAmount
    resource.update({ amount: newAmount })
  })

  return sess.state
}

export const explore = createAction('EXPLORE')
export const exploreReducer = (sess, payload = {}) => {
  const { systemId, planetId, continentId } = payload
  let explorable
  if (typeof systemId === 'number') {
    const system = sess.System.withId(systemId)
    explorable = getList(system.planets).filter((c) => !c.explored)[0]
  } else if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    explorable = getList(planet.continents).filter((c) => !c.explored)[0]
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    explorable = getList(continent.plots).filter((p) => !p.explored)[0]
  } else {
    explorable = getList(sess.System).filter((p) => !p.explored)[0]
  }
  explorable.update({ explored: true })
  return sess.state
}

export const settle = createAction('SETTLE')
export const settleReducer = (sess, payload = {}) => {
  const { systemId, planetId, continentId } = payload
  let plotId
  if (typeof systemId === 'number') {
    const system = sess.System.withId(systemId)
    const plot = getFirstDeep(system, 'planets.continents.plots')
    plotId = plot.id
  } else if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    const plot = getFirstDeep(planet, 'continents.plots')
    plotId = plot.id
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    const plot = getFirst(continent.plots)
    plotId = plot.id
  }
  createCityReducer(sess, { plotId })
  return sess.state
}
