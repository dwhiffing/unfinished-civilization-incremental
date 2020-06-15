import { createAction } from '@reduxjs/toolkit'

export const createTile = createAction('CREATE_TILE')
export const createTileReducer = (sess, payload) => {
  const { cityId } = payload

  sess.Tile.create({ cityId })
  return sess.state
}
