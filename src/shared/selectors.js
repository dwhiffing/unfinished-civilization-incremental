import { createSelector } from 'redux-orm'
import { totalResources } from './utils'
import orm from '../orm'

export const getBuyables = createSelector(orm.Buyable)
export const getUnlocks = createSelector(orm, (session) =>
  session.Unlock.all()
    .toModelArray()
    .map((unlock) => unlock.ref.id),
)

const getStockpiles = createSelector(orm.ResourceStockpile)

export const getResourceTotals = createSelector(
  orm,
  getStockpiles,
  (_, stockpiles) => totalResources(stockpiles),
)
