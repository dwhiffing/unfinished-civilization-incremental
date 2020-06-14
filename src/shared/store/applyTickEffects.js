import { tickPeople } from '../../city/store/tickPeople'
import { tickSeats } from '../../city/store/tickSeats'
import { tickCities } from '../../city/store/tickCities'
import { updateResourceReducer } from './updateResource'
import { createAction } from '@reduxjs/toolkit'

export const tick = createAction('TICK')
export const applyTickEffectsReducer = (sess) => {
  let updates = []
  tickPeople(sess, updates)
  tickSeats(sess, updates)
  tickCities(sess, updates)

  updates.forEach((update) => updateResourceReducer(sess, update))

  return sess.state
}
