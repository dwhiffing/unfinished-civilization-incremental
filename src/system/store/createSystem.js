import random from 'lodash/random'
import times from 'lodash/times'
import { createPlanetReducer } from '../../planet/store'
import { PLANET_COUNT_RANGE, getUniqueName } from '../../shared/data'
import { SYSTEM_NAMES } from '../data'

export const createSystemReducer = (sess, planet = {}) => {
  const systemInstance = sess.System.create({
    ...planet,
    explored: false,
    label: getUniqueName(sess.System, SYSTEM_NAMES),
  })
  times(random(...PLANET_COUNT_RANGE), () =>
    createPlanetReducer(sess, { systemId: systemInstance.ref.id }),
  )

  return sess.state
}
