import clamp from 'lodash/clamp'
export function updateResource(
  sess,
  { resourceId, value, cityId, continentId, planetId },
) {
  if (typeof cityId === 'number') {
    let resource = sess.ResourceStockpile.all()
      .toModelArray()
      .find((r) => {
        return (
          r.resourceId === resourceId &&
          r.city
            .all()
            .toRefArray()
            .some((c) => c.id === cityId)
        )
      })
    if (resource && resource.ref.amount + value >= 0) {
      resource.update({
        amount: resource.ref.amount + value,
      })
      return sess.state
    }
  } else {
    let amountToConsume = Math.abs(value)
    while (amountToConsume > 0) {
      const cities = sess.City.all()
        .toModelArray()
        .filter((c) => {
          if (planetId) {
            return (
              c.continent.toModelArray()[0].planet.toRefArray()[0].id ===
              +planetId
            )
          }
          if (continentId) {
            return c.continent.toRefArray()[0].id === +continentId
          }
          return true
        })
      const validResources = cities
        .map((city) => {
          const resource = city.resources
            .all()
            .toModelArray()
            .find((r) => r.ref.resourceId === resourceId && r.ref.amount > 0)
          return resource
        })
        .filter((t) => !!t)
      const resource = validResources[0]
      if (resource) {
        let amt = resource.ref.amount
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
