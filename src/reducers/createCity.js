import { createPerson } from './createPerson'
import { createBuilding } from './createBuilding'
import { CITIES, getUniqueName } from '../data'
import { getFirst } from '../selectors'

export const createCity = (sess, payload) => {
  const {
    plotId,
    label = getUniqueName(sess.City, CITIES),
    people = [{}],
    resources = [],
    buildings = [],
  } = payload

  const plot = sess.Plot.withId(plotId)
  const allResources = sess.Resource.all().toModelArray()
  const allBuildings = sess.BuildingType.all().toModelArray()
  const cityInstance = sess.City.create({ label })
  const cityId = cityInstance.ref.id

  allResources.forEach(({ id }) => {
    const _resource = resources.find((r) => r.resourceId === id)
    const amount = _resource ? _resource.amount : 0
    cityInstance.resources.add(
      sess.ResourceStockpile.create({ resourceId: id, amount }),
    )
  })
  people.forEach((person) => createPerson(sess, { cityId, person }))
  allBuildings.forEach(({ id }) => {
    const _building = buildings.find((r) => r.buildingId === id) || {}
    createBuilding(sess, { cityId, building: { buildingId: id, ..._building } })
  })
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
