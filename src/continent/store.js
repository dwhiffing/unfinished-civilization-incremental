import times from 'lodash/times'
import sample from 'lodash/sample'
import random from 'lodash/random'
import { CONTINENT_NAMES } from './data'
import { getUniqueName, PLOT_COUNT_RANGE } from '../shared/data'

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
    createPlotReducer(sess, { continentId: continent.id }),
  )
  return sess.state
}

export const createPlotReducer = (sess, payload = {}) => {
  const { continentId, ...plot } = payload
  const continent = sess.Continent.withId(continentId)
  const plotInstance = sess.Plot.create({
    ...plot,
    biome: sample(continent.biomes),
  })
  continent.plots.add(plotInstance)
  return sess.state
}
