import { createPerson } from './createPerson'
import { createBuilding } from './createBuilding'
import { CITIES, getUniqueName } from '../data'
import { getFirst } from '../selectors'

export const createCity = (sess, payload) => {
  const {
    plotId,
    label = getUniqueName(sess.City, CITIES),
    people = [{}],
  } = payload

  const plot = sess.Plot.withId(plotId)
  const allResources = sess.Resource.all().toModelArray()
  const cityInstance = sess.City.create({ label, housing: 5 })
  const cityId = cityInstance.ref.id

  allResources.forEach(({ id }) => {
    const _resource = sess.Resource.withId(id)
    const amount = _resource ? _resource.ref.amount : 0
    const limit = _resource ? _resource.ref.limit : 100
    cityInstance.resources.add(
      sess.ResourceStockpile.create({ resourceId: id, amount, limit }),
    )
  })
  people.forEach((person) => createPerson(sess, { cityId, person }))
  createBuilding(sess, { cityId, buildingTypeId: 'center' })

  const continent = getFirst(plot.continent)
  const planet = getFirst(continent.planet)
  const system = getFirst(planet.system)
  plot.update({ explored: true })
  continent.update({ explored: true })
  planet.update({ explored: true })
  system.update({ explored: true })
  plot.cities.add(cityInstance)

  return sess.state
}
