import clamp from 'lodash/clamp'
import { getFirstDeep, getList } from '../selectors'
import { unlockReducer } from './unlock'

export function updateResourceReducer(sess, { resourceId: id, value, ...ids }) {
  if (value === 0) return sess.state

  unlockReducer(sess, id)

  let remaining = value
  getList(sess.City)
    .filter(getCitiesByIds({ ...ids }))
    .forEach((city) => {
      const resource = getList(city.resources).find(
        ({ ref }) => ref.resourceId === id,
      )
      let { amount, limit } = resource.ref
      const newAmount = clamp(amount + remaining, 0, limit)
      remaining = amount + remaining - newAmount
      resource.update({ amount: newAmount })
    })

  return sess.state
}

const getCitiesByIds = ({ systemId, planetId, continentId, cityId }) => (c) => {
  if (systemId) {
    const system = getFirstDeep(c, 'plot.continent.planet.system')
    return system.id === +systemId
  }
  if (planetId) {
    const planet = getFirstDeep(c, 'plot.continent.planet')
    return planet.id === +planetId
  }
  if (continentId) {
    const continent = getFirstDeep(c, 'plot.continent')
    return continent.id === +continentId
  }
  if (cityId) {
    return c.id === +cityId
  }
  return true
}
