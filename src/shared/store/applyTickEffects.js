import { tickCities } from '../../city/store/tickCities'
import { createAction } from '@reduxjs/toolkit'

export const tick = createAction('TICK')
export const applyTickEffectsReducer = (sess) => {
  tickCities(sess)

  return sess.state
}
