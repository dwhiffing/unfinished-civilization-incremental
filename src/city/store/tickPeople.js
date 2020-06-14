import { FOOD_DRAIN } from '../../shared/data'
import { createAction } from '@reduxjs/toolkit'

export const createPerson = createAction('CREATE_PERSON')
export function tickPeople(sess, updates) {
  sess.City.all()
    .toModelArray()
    .forEach((city) => {
      updates.push({
        resourceId: 'food',
        id: city.id,
        value: FOOD_DRAIN * -city.people.all().toModelArray().length,
      })
    })
}
