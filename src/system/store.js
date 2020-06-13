import random from 'lodash/random'
import times from 'lodash/times'
import { createPlanet } from '../planet/store'
import { PLANET_COUNT_RANGE, getUniqueName } from '../shared/data'
import { SYSTEM_NAMES } from './data'

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
