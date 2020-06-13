import sample from 'lodash/sample'

export const createPlot = (sess, payload = {}) => {
  const { continentId, ...plot } = payload
  const continent = sess.Continent.withId(continentId)
  const plotInstance = sess.Plot.create({
    ...plot,
    biome: sample(continent.biomes),
  })
  continent.plots.add(plotInstance)
  return sess.state
}
