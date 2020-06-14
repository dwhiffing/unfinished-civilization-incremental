import sample from 'lodash/sample'

export const createPlotReducer = (sess, payload = {}) => {
  const { continentId, ...plot } = payload
  const continent = sess.Continent.withId(continentId)
  sess.Plot.create({
    ...plot,
    biome: sample(continent.biomes),
    continentId,
  })
  return sess.state
}
