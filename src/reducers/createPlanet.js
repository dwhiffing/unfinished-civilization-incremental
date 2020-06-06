import { createContinent } from './createContinent'
import sample from 'lodash/sample'
import { PLANETS } from '../data'

export const createPlanet = (sess, planet = {}) => {
  const planetInstance = sess.Planet.create({
    ...planet,
    label: sample(PLANETS),
  })
  createContinent(sess, { planetId: planetInstance.ref.id })
  return sess.state
}
