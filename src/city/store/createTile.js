import sample from 'lodash/sample'
import { createAction } from '@reduxjs/toolkit'
import { BASE_EFFECTS, RESOURCE_EFFECTS } from '../models/Tile'

export const createTile = createAction('CREATE_TILE')
export const createTileReducer = (sess, payload) => {
  const { cityId } = payload

  sess.Tile.create({
    cityId,
    feature: sample(Object.keys(BASE_EFFECTS)),
    resource: sample([null, ...Object.keys(RESOURCE_EFFECTS)]),
  })
  return sess.state
}
