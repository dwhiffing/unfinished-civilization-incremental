import { createAction } from '@reduxjs/toolkit'
import { createCityReducer } from '../city/store'
import { tickCities, tickPeople, tickSeats } from '../city/store'
import random from 'lodash/random'
import pickBy from 'lodash/pickBy'
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

export const createInitial = createAction('INIT')
export const createInitialReducer = (sess) => {
  if (sess.System.all().toRefArray().length === 0) {
    // TODO: these should update the stats of the loaded entities if already started
    buyables.forEach((buyable) => sess.Buyable.create({ ...buyable }))
    resources.forEach((resource) =>
      sess.Resource.create({ ...resource, amount: 0 }),
    )
    tasks.forEach((task) => sess.Task.create({ ...task }))
    districtTypes.forEach(({ ...districtType }) =>
      sess.DistrictType.create({ ...districtType }),
    )

    times(random(...SYSTEM_COUNT_RANGE), () => createSystem(sess, {}))
    createCityReducer(sess, { plotId: sess.Plot.first().id })
    unlockReducer(sess, 'center')
    updateResourceReducer(sess, { resourceId: 'food', id: 0, value: 100 })

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
export function updateResourceReducer(sess, { resourceId, value, ...ids }) {
  if (value === 0) return sess.state

  unlockReducer(sess, resourceId)
  let remaining = value
  sess.City.filter(pickBy(ids, (v) => typeof v === 'number'))
    .toModelArray()
    .forEach((city) => {
      const stockpile = city.stockpiles.filter({ resourceId }).first()
      const newAmount = clamp(stockpile.amount + remaining, 0, stockpile.limit)
      remaining = stockpile.amount + remaining - newAmount
      stockpile.update({ amount: newAmount })
    })

  return sess.state
}

export const explore = createAction('EXPLORE')
export const exploreReducer = (sess, payload = {}) => {
  const { systemId, planetId, continentId } = payload
  let explorable
  if (typeof systemId === 'number') {
    const system = sess.System.withId(systemId)
    explorable = system.planets.exclude({ explored: true }).first()
  } else if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    explorable = planet.continents.exclude({ explored: true }).first()
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    explorable = continent.plots.exclude({ explored: true }).first()
  } else {
    explorable = sess.System.exclude({ explored: true }).first()
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
    plotId = system.planets.first().continents.first().plots.first().id
  } else if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    plotId = planet.continents.first().plots.first().id
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    plotId = continent.plots.first().id
  }
  createCityReducer(sess, { plotId })
  return sess.state
}
