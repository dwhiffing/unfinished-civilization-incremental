import times from 'lodash/times'
import random from 'lodash/random'
import { CONTINENTS, getUniqueName } from '../data'
import { createPlot } from './createPlot'

export const createContinent = (sess, payload = {}) => {
  const {
    planetId,
    label = getUniqueName(sess.Continent, CONTINENTS),
    ...continentOpts
  } = payload
  const continent = sess.Continent.create({
    ...continentOpts,
    explored: false,
    label,
  })
  const planet = sess.Planet.withId(planetId)
  planet.continents.add(continent)
  times(random(3, 6), () => createPlot(sess, { continentId: continent.id }))
  return sess.state
}
