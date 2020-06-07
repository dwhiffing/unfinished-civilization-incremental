import { createCity } from './createCity'
import { getFirst, getFirstDeep } from '../selectors'

export const settle = (sess, payload = {}) => {
  const { planetId, continentId } = payload
  let plotId
  if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    const plot = getFirstDeep(planet, 'continents.plots')
    plotId = plot.id
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    const plot = getFirst(continent.plots)
    plotId = plot.id
  }
  createCity(sess, { plotId })
  return sess.state
}
