import { createAction } from '@reduxjs/toolkit'

export const purchaseBuyable = createAction('PURCHASE_BUYABLE')
export function purchaseBuyableReducer(sess, payload) {
  const buyable = sess.Buyable.withId(payload)
  buyable.update({ purchased: true })
  return sess.state
}
