import { createPersonReducer } from './createPerson'
import { updateResourceReducer as updateResource } from '../../shared/store/updateResource'
import { getCityResourceChange } from './getCityResourceChange'

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
        createPersonReducer(sess, { cityId: city.id })
      }

      // TODO: need to use this functionality to display stats on resource totals
      // and on tile items to show loss/profit
      const change = getCityResourceChange({
        housing: city.housing,
        tiles: city.tiles.toModelArray(),
        numPeople: city.people.count(),
      })

      Object.entries(change.total).forEach(([resourceId, value]) => {
        updateResource(sess, { resourceId, id: city.id, value })
      })
    })
}
