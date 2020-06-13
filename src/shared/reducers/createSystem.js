import random from 'lodash/random'
import times from 'lodash/times'
import { createPlanet } from './createPlanet'
import { getUniqueName, PLANET_COUNT_RANGE } from '../../data'
import { SYSTEM_NAMES } from '../../system/data'

export const createSystem = (sess, planet = {}) => {
  const systemInstance = sess.System.create({
    ...planet,
    explored: false,
    label: getUniqueName(sess.System, SYSTEM_NAMES),
  })
  times(random(...PLANET_COUNT_RANGE), () =>
    createPlanet(sess, { systemId: systemInstance.ref.id }),
  )

  return sess.state
}
