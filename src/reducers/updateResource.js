import clamp from 'lodash/clamp'
import { getFirstDeep, getFirst, getList } from '../selectors'
import { unlock } from './unlock'
export function updateResource(
  sess,
  { resourceId, value, cityId, continentId, planetId, systemId },
) {
  if (typeof cityId === 'number') {
    // find resource stockpile for city
    let resource = getList(sess.ResourceStockpile).find(
      (r) => r.resourceId === resourceId && getFirst(r.city).id === cityId,
    )
    const { amount: baseAmount, limit } = resource.ref
    const amount = clamp(baseAmount + value, 0, limit)
    resource.update({ amount })
    unlock(sess, resource.resourceId)
    return sess.state
  } else {
    let amountToConsume = Math.abs(value)
    while (amountToConsume > 0) {
      const cities = getList(sess.City).filter((c) => {
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
        return true
      })
      const validResources = cities
        .map((city) =>
          getList(city.resources).find(
            ({ ref }) => ref.resourceId === resourceId && ref.amount > 0,
          ),
        )
        .filter((t) => !!t)
      const resource = validResources[0]
      if (resource) {
        let amt = resource.ref.amount
        unlock(sess, resource.resourceId)
        resource.update({
          amount:
            resource.ref.amount -
            clamp(amountToConsume, 0, resource.ref.amount),
        })
        amountToConsume -= amt
      } else {
        break
      }
    }
  }
  return sess.state
}
