import pickBy from 'lodash/pickBy'
import clamp from 'lodash/clamp'
import { unlockReducer } from './unlock'
import { createAction } from '@reduxjs/toolkit'

export const updateResource = createAction('UPDATE_RESOURCE')
export function updateResourceReducer(sess, { resourceId, value, ...ids }) {
  if (value === 0) return sess.state

  if (/science|faith|culture/.test(resourceId)) {
    console.log(value, resourceId)
    const stockpile = sess.ResourceStockpile.filter({ resourceId }).first()
    stockpile.update({ amount: getNewAmount(stockpile, value) })
    return sess.state
  }

  unlockReducer(sess, resourceId)
  let remaining = value
  const cities = sess.City.filter(
    pickBy(ids, (v) => typeof v === 'number'),
  ).toModelArray()
  cities.forEach((city) => {
    const stockpile = city.stockpiles.filter({ resourceId }).first()
    stockpile.update({ amount: getNewAmount(stockpile, remaining) })
  })

  return sess.state
}

const getNewAmount = (stockpile, remaining) => {
  const newAmount = clamp(
    stockpile.amount + remaining,
    0,
    stockpile.limit === -1 ? 999999999 : stockpile.limit,
  )
  remaining = stockpile.amount + remaining - newAmount
  return newAmount
}
