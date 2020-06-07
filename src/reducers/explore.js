import { getList } from '../selectors'

export const explore = (sess, payload = {}) => {
  const { planetId, continentId } = payload
  let explorable
  if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    explorable = getList(planet.continents).filter((c) => !c.explored)[0]
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    explorable = getList(continent.plots).filter((p) => !p.explored)[0]
  } else {
    explorable = getList(sess.Planet).filter((p) => !p.explored)[0]
  }
  explorable.update({ explored: true })
  return sess.state
}
