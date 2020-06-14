import random from 'lodash/random'
import sample from 'lodash/sample'
import times from 'lodash/times'
import { createContinentReducer } from '../../continent/store/createContinent'
import { getUniqueName, CONTINENT_COUNT_RANGE } from '../../shared/data'
import { PLANET_NAMES, PLANET_TYPES } from '../data'

export const createPlanetReducer = (sess, payload = {}) => {
  const { systemId, ...planet } = payload
  const planetInstance = sess.Planet.create({
    ...planet,
    type: sample(PLANET_TYPES),
    label: getUniqueName(sess.Planet, PLANET_NAMES),
    systemId,
  })
  times(random(...CONTINENT_COUNT_RANGE), () =>
    createContinentReducer(sess, { planetId: planetInstance.ref.id }),
  )

  return sess.state
}
