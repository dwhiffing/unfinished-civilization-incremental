import times from 'lodash/times'
import random from 'lodash/random'
import { CONTINENTS, getUniqueName } from '../data'
import { createPlot } from './createPlot'
import { PLOT_COUNT_RANGE } from '../data'

export const createContinent = (sess, payload = {}) => {
  const {
    planetId,
    label = getUniqueName(sess.Continent, CONTINENTS),
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
