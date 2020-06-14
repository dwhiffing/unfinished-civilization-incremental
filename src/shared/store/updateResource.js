import pickBy from 'lodash/pickBy'
import clamp from 'lodash/clamp'
import { unlockReducer } from './unlock'
import { createAction } from '@reduxjs/toolkit'

export const updateResource = createAction('UPDATE_RESOURCE')
export function updateResourceReducer(sess, { resourceId, value, ...ids }) {
  if (value === 0) return sess.state

  unlockReducer(sess, resourceId)
  let remaining = value
  sess.City.filter(pickBy(ids, (v) => typeof v === 'number'))
    .toModelArray()
    .forEach((city) => {
      const stockpile = city.stockpiles.filter({ resourceId }).first()
      const newAmount = clamp(stockpile.amount + remaining, 0, stockpile.limit)
      remaining = stockpile.amount + remaining - newAmount
      stockpile.update({ amount: newAmount })
    })

  return sess.state
}
