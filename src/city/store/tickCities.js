import { createPersonReducer } from './createPerson'
export function tickCities(sess, updates) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      const pop = city.people.all().toRefArray().length
      const growth = city.stockpiles
        .all()
        .toRefArray()
        .find((s) => s.resourceId === 'growth')
      if (pop < city.housing) {
        updates.push({
          resourceId: 'growth',
          id: city.id,
          value: 1,
        })
        if (growth && growth.amount >= 5) {
          createPersonReducer(sess, { cityId: city.id })
          updates.push({
            resourceId: 'growth',
            id: city.id,
            value: -5,
          })
        }
      }
    })
}
