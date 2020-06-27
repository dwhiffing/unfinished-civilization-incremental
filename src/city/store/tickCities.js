import { createPersonReducer } from './createPerson'
import { updateResourceReducer as updateResource } from '../../shared/store/updateResource'
import { getCityResourceStats } from '../selectors'

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

      // TODO: need to handle starvation

      const change = getCityResourceStats({ root: sess.state }, city.id)
      Object.entries(change.total).forEach(([resourceId, value]) => {
        updateResource(sess, { resourceId, id: city.id, value })
      })
    })
}
