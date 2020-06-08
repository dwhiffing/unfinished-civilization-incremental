import random from 'lodash/random'
import times from 'lodash/times'
import { createPlanet } from './createPlanet'
import { SYSTEMS, getUniqueName, PLANET_COUNT_RANGE } from '../data'

export const createSystem = (sess, planet = {}) => {
  const systemInstance = sess.System.create({
    ...planet,
    explored: false,
    label: getUniqueName(sess.System, SYSTEMS),
  })
  times(random(...PLANET_COUNT_RANGE), () =>
    createPlanet(sess, { systemId: systemInstance.ref.id }),
  )

  return sess.state
}
