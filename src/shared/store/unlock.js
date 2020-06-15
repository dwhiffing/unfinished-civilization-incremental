import { createAction } from '@reduxjs/toolkit'

export const unlock = createAction('UNLOCK')
export const unlockReducer = (sess, payload = {}) => {
  if (!sess.Unlock.withId(payload)) {
    sess.Unlock.create({ id: payload })
  }
  return sess.state
}
