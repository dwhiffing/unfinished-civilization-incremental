import { createAction } from '@reduxjs/toolkit'

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
