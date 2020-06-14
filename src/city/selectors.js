import { createSelector } from 'redux-orm'
import orm from '../orm'
import {
  getList,
  totalResources,
  getFirst,
  getFirstDeep,
} from '../shared/selectors'

export const getDistrictTypes = createSelector(orm, (session) =>
  getList(session.DistrictType),
)

export const getStockpiles = createSelector(orm, (session) =>
  getList(session.ResourceStockpile),
)

export const getCities = createSelector(orm, (session) =>
  getList(session.City).map((city) => makeGetCity(session, city)),
)

export const getCityResourceTotals = (cityId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(stockpiles.filter((r) => r.city.first().id === cityId)),
  )

export const makeGetCity = (sess, city) => ({
  ...city.ref,
  people: city.people.toRefArray(),
  resources: getList(city.resources).map((r) => ({
    ...r.ref,
    color: sess.Resource.withId(r.resourceId)
      ? sess.Resource.withId(r.resourceId).ref.color
      : null,
  })),
  plot: getFirst(city.plot).ref,
  continent: getFirst(getFirst(city.plot).continent).ref,
  districts: getList(city.districts).map((district) => {
    const districtType = sess.DistrictType.withId(district.districtTypeId)
    return {
      ...district.ref,
      label: districtType ? districtType.label : null,
      seats: district.seats.toRefArray().map((seat) => ({
        ...seat,
        task: sess.Task.withId(seat.taskId)
          ? sess.Task.withId(seat.taskId).ref
          : null,
        district: { ...district.ref, cityId: city.id },
        person: seat.person ? { ...seat.person._fields } : null,
      })),
    }
  }),
})

export const getCitiesByIds = (
  sess,
  { systemId, planetId, continentId, cityId },
) =>
  getList(sess.City).filter((c) => {
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
  })
