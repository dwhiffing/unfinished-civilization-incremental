import { CITY_NAMES } from '../data'
import { RESOURCE_MULTIPLIER, getUniqueName } from '../../shared/data'
import { createPersonReducer } from './createPerson'
import { createDistrictReducer } from './createDistrict'
import { createAction } from '@reduxjs/toolkit'

export const createCity = createAction('CREATE_CITY')
export const createCityReducer = (sess, payload) => {
  const {
    plotId,
    label = getUniqueName(sess.City, CITY_NAMES),
    people = [{}],
  } = payload

  const plot = sess.Plot.withId(plotId)
  const allResources = sess.Resource.all().toModelArray()
  const cityInstance = sess.City.create({
    label,
    housing: 5,
    continentId: plot.continent.id,
    planetId: plot.continent.planet.id,
    systemId: plot.continent.planet.system.id,
  })
  const cityId = cityInstance.ref.id

  allResources.forEach(({ id }) => {
    const _resource = sess.Resource.withId(id)
    const amount = _resource ? _resource.ref.amount : 0
    const _limit = _resource ? _resource.ref.limit : 100
    const color = _resource ? _resource.ref.color : 'black'
    const limit = _limit * RESOURCE_MULTIPLIER
    sess.ResourceStockpile.create({
      resourceId: id,
      amount,
      limit,
      cityId,
      color,
    })
  })
  people.forEach((person) => createPersonReducer(sess, { cityId, person }))
  createDistrictReducer(sess, { cityId, districtTypeId: 'center' })

  plot.update({ explored: true, cityId })
  plot.continent.update({ explored: true })
  plot.continent.planet.update({ explored: true })
  plot.continent.planet.system.update({ explored: true })

  return sess.state
}
