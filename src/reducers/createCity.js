import { createPerson } from './createPerson'
import { createDistrict } from './createDistrict'
import { CITIES, getUniqueName, RESOURCE_MULTIPLIER } from '../data'
import { getFirst } from '../selectors'

export const createCity = (sess, payload) => {
  const {
    plotId,
    label = getUniqueName(sess.City, CITIES),
    people = [{}],
  } = payload

  const plot = sess.Plot.withId(plotId)
  const allResources = sess.Resource.all().toModelArray()
  const continent = getFirst(plot.continent)
  const planet = getFirst(continent.planet)
  const system = getFirst(planet.system)
  const cityInstance = sess.City.create({
    label,
    housing: 5,
    continentId: continent.id,
    planetId: planet.id,
    systemId: system.id,
  })
  const cityId = cityInstance.ref.id

  allResources.forEach(({ id }) => {
    const _resource = sess.Resource.withId(id)
    const amount = _resource ? _resource.ref.amount : 0
    const _limit = _resource ? _resource.ref.limit : 100
    const limit = _limit * RESOURCE_MULTIPLIER
    cityInstance.resources.add(
      sess.ResourceStockpile.create({ resourceId: id, amount, limit }),
    )
  })
  people.forEach((person) => createPerson(sess, { cityId, person }))
  createDistrict(sess, { cityId, districtTypeId: 'center' })

  plot.update({ explored: true })
  continent.update({ explored: true })
  planet.update({ explored: true })
  system.update({ explored: true })
  plot.cities.add(cityInstance)

  return sess.state
}
