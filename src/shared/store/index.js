import { createAction } from '@reduxjs/toolkit'

export { applyTickEffectsReducer } from './applyTickEffects'
export { createInitialReducer } from './createInitial'
export { exploreReducer } from './explore'
export { settleReducer } from './settle'
export { unlockReducer } from './unlock'
export { updateResourceReducer } from './updateResource'

export const createInitial = createAction('INIT')
export const tick = createAction('TICK')
export const updateResource = createAction('UPDATE_RESOURCE')
export const explore = createAction('EXPLORE')
export const settle = createAction('SETTLE')
export const unlock = createAction('UNLOCK')
