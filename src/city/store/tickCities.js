import { createPersonReducer } from './createPerson'
import { updateResourceReducer as updateResource } from '../../shared/store/updateResource'
import { getCityResourceChange } from './getCityResourceChange'
import mapValues from 'lodash/mapValues'

export function tickCities(sess) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      // Handle growth
      const food = city.stockpiles.filter({ resourceId: 'food' }).first()
      if (food.amount >= food.limit) {
        updateResource(sess, {
          resourceId: 'food',
          id: city.id,
          value: food.limit * -0.9,
        })
        food.update({ limit: Math.pow(food.limit, 1.15) })
        createPersonReducer(sess, { cityId: city.id })
      }

      const buildingIds = city.tiles
        .toModelArray()
        .map((t) => t.district)
        .flat()
        .filter((b) => b && b.buildings)
        .map((d) => Object.values(d.buildings).map((b) => b.id))
      const buildings = buildingIds.map((id) => sess.Building.withId(id))
      const housing = buildings
        .map((b) => b.effects)
        .reduce((sum, e) => sum + e.housing, city.housing)
      // TODO: need a better way to ensure this function is called with the same data as the selector
      // tiles district buildings don't have effects decorated on them here
      const tiles = city.tiles.toModelArray().map((t) => ({
        ...t._fields,
        person: typeof t.personId === 'number',
        district: t.district
          ? {
              ...t.district._fields,
              buildings: t.district.buildings
                ? mapValues(t.district.buildings, (b) => {
                    const building = sess.Building.withId(b.id)
                    return { ...b, ...building._fields }
                  })
                : null,
            }
          : null,
      }))
      const numPeople = city.people.count()

      const change = getCityResourceChange({ housing, tiles, numPeople })

      Object.entries(change.total).forEach(([resourceId, value]) => {
        updateResource(sess, { resourceId, id: city.id, value })
      })
    })
}
