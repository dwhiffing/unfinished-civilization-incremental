import { getList } from '../shared/selectors'

export const explore = (sess, payload = {}) => {
  const { systemId, planetId, continentId } = payload
  let explorable
  if (typeof systemId === 'number') {
    const system = sess.System.withId(systemId)
    explorable = getList(system.planets).filter((c) => !c.explored)[0]
  } else if (typeof planetId === 'number') {
    const planet = sess.Planet.withId(planetId)
    explorable = getList(planet.continents).filter((c) => !c.explored)[0]
  } else if (typeof continentId === 'number') {
    const continent = sess.Continent.withId(continentId)
    explorable = getList(continent.plots).filter((p) => !p.explored)[0]
  } else {
    explorable = getList(sess.System).filter((p) => !p.explored)[0]
  }
  explorable.update({ explored: true })
  return sess.state
}
