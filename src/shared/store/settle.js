import { createCityReducer } from '../../city/store/createCity'
import { createAction } from '@reduxjs/toolkit'

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
