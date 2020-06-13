import times from 'lodash/times'
import random from 'lodash/random'
import { CONTINENT_NAMES } from './data'
import { getUniqueName } from '../data'
import { createPlot } from '../reducers/createPlot'
import { PLOT_COUNT_RANGE } from '../data'

export const createContinentReducer = (sess, payload = {}) => {
  const {
    planetId,
    label = getUniqueName(sess.Continent, CONTINENT_NAMES),
    ...continentOpts
  } = payload
  const planet = sess.Planet.withId(planetId)
  const continent = sess.Continent.create({
    ...continentOpts,
    explored: false,
    biomes: planet.type.biomes,
    label,
  })
  planet.continents.add(continent)
  times(random(...PLOT_COUNT_RANGE), () =>
    createPlot(sess, { continentId: continent.id }),
  )
  return sess.state
}
