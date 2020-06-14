import { tickCities } from '../../city/store/tickCities'
import { updateResourceReducer } from './updateResource'
import { createAction } from '@reduxjs/toolkit'

export const tick = createAction('TICK')
export const applyTickEffectsReducer = (sess) => {
  let updates = []

  tickCities(sess, updates)

  updates.forEach((update) => updateResourceReducer(sess, update))

  return sess.state
}
