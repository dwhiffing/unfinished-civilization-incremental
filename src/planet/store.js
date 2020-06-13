import random from 'lodash/random'
import sample from 'lodash/sample'
import times from 'lodash/times'
import { createContinentReducer } from '../continent/store'
import { getUniqueName, CONTINENT_COUNT_RANGE } from '../shared/data'
import { PLANET_NAMES, TYPES } from './data'

export const createPlanet = (sess, payload = {}) => {
  const { systemId, ...planet } = payload
  const planetInstance = sess.Planet.create({
    ...planet,
    type: sample(TYPES),
    label: getUniqueName(sess.Planet, PLANET_NAMES),
  })
  const system = sess.System.withId(systemId)
  system.planets.add(planetInstance)
  times(random(...CONTINENT_COUNT_RANGE), () =>
    createContinentReducer(sess, { planetId: planetInstance.ref.id }),
  )

  return sess.state
}
