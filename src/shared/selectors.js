import { createSelector } from 'redux-orm'
import orm from '../models'
import { getStockpiles } from '../city/selectors'

export const getList = (model) => {
  if (!model) debugger
  return model.all().toModelArray()
}

export const getRefList = (model) => {
  if (!model) debugger
  return model.all().toRefArray()
}

export const getFirst = (model) => getList(model)[0]

export const totalResources = (list) => {
  let resources = {}
  list.forEach((stockpile) => {
    const { ref } = stockpile
    resources[ref.resourceId] = resources[ref.resourceId] || {
      amount: 0,
      limit: 0,
      color: stockpile.resource && stockpile.resource.color,
    }
    resources[ref.resourceId].amount += ref.amount
    resources[ref.resourceId].limit += ref.limit
  })
  return resources
}

export const getFirstDeep = (thing, path) => {
  const paths = path.split('.')
  let resolved = thing
  while (paths.length > 0) {
    const p = paths.shift()
    resolved = getFirst(resolved[p])
  }
  return resolved
}

export const getUnlocks = createSelector(orm, (session) =>
  getList(session.Unlock).map((unlock) => unlock.ref.id),
)

export const getBuyables = createSelector(orm, (session) =>
  session.Buyable.all().toRefArray(),
)

export const getResourceTotals = createSelector(
  orm,
  getStockpiles,
  (_, stockpiles) => totalResources(stockpiles),
)
