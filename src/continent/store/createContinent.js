import times from 'lodash/times'
import random from 'lodash/random'
import { CONTINENT_NAMES } from '../data'
import { getUniqueName, PLOT_COUNT_RANGE } from '../../shared/data'
import { createPlotReducer } from './createPlot'

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
    planetId,
  })
  times(random(...PLOT_COUNT_RANGE), () =>
    createPlotReducer(sess, { continentId: continent.id }),
  )
  return sess.state
}
