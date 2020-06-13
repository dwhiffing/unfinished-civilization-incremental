import { createSelector } from 'redux-orm'
import orm from '../orm'
import { getStockpiles } from '../city/selectors'
import { getList, totalResources } from '../shared/selectors'
import { makeGetPlanet } from '../planet/selectors'

export const getSystems = createSelector(orm, (session) =>
  getList(session.System).map((system) => {
    const planets = getList(system.planets).map((planet) =>
      makeGetPlanet(session, planet),
    )
    return {
      ...system.ref,
      settled: planets.some((p) => p.settled),
      planets,
    }
  }),
)

export const getSystemResourceTotals = (systemId) =>
  createSelector(orm, getStockpiles, (_, stockpiles) =>
    totalResources(
      stockpiles.filter((r) => r.city.first().systemId === systemId),
    ),
  )
