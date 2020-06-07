import random from 'lodash/random'
import times from 'lodash/times'
import { createContinent } from './createContinent'
import { PLANETS, getUniqueName } from '../data'

export const createPlanet = (sess, planet = {}) => {
  const planetInstance = sess.Planet.create({
    ...planet,
    label: getUniqueName(sess.Planet, PLANETS),
  })
  times(random(2, 4), () =>
    createContinent(sess, { planetId: planetInstance.ref.id }),
  )

  return sess.state
}
