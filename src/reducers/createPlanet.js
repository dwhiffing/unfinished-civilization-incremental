import random from 'lodash/random'
import sample from 'lodash/sample'
import times from 'lodash/times'
import { createContinent } from './createContinent'
import {
  PLANETS,
  PLANET_TYPES,
  getUniqueName,
  CONTINENT_COUNT_RANGE,
} from '../data'

export const createPlanet = (sess, payload = {}) => {
  const { systemId, ...planet } = payload
  const planetInstance = sess.Planet.create({
    ...planet,
    type: sample(PLANET_TYPES),
    label: getUniqueName(sess.Planet, PLANETS),
  })
  const system = sess.System.withId(systemId)
  system.planets.add(planetInstance)
  times(random(...CONTINENT_COUNT_RANGE), () =>
    createContinent(sess, { planetId: planetInstance.ref.id }),
  )

  return sess.state
}
