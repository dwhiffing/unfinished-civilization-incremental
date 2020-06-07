export const createPlot = (sess, payload = {}) => {
  const { continentId, ...plot } = payload
  const plotInstance = sess.Plot.create({ ...plot })
  const continent = sess.Continent.withId(continentId)
  continent.plots.add(plotInstance)
  return sess.state
}
