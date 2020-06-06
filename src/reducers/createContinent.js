import { createCity } from './createCity'
import sample from 'lodash/sample'
import { CONTINENTS } from '../data'
export const createContinent = (sess, payload = {}) => {
  const { planetId, label = sample(CONTINENTS), ...continent } = payload
  const continentInstance = sess.Continent.create({ ...continent, label })
  const planet = sess.Planet.withId(planetId)
  planet.continents.add(continentInstance)
  createCity(sess, { continentId: continentInstance.ref.id })
  return sess.state
}
