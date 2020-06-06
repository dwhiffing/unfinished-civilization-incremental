import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import {
  getBuyables,
  getContinentResourceTotals,
  getPlanetResourceTotals,
  getCityResourceTotals,
  getResourceTotals,
} from '../selectors'
import { updateResource } from '../actions'

export const Purchase = ({ id, action, ...ids }) => {
  const dispatch = useDispatch()
  const buyable = useSelector(getBuyables).find((b) => b.id === id)
  const isAffordable = useGetIsAffordable({ buyable, ...ids })
  const cost = JSON.stringify(buyable.cost)
    .replace(/"/g, '')
    .replace(/\{|\}/g, '')

  const attemptPurchase = async () => {
    if (isAffordable) {
      await Promise.all(
        Object.entries(buyable.cost).map(([resourceId, value]) =>
          dispatch(updateResource({ resourceId, value: -value, ...ids })),
        ),
      )
      await dispatch(action)
    }
  }

  return (
    <Button
      onClick={attemptPurchase}
      style={{ opacity: isAffordable ? 1 : 0.5 }}
    >
      {buyable.label} ({cost})
    </Button>
  )
}

const useGetIsAffordable = ({ buyable, ...ids }) => {
  const totals = useGetTotals(ids)
  return Object.entries(buyable.cost).every(([key, value]) => {
    const targetResource = Object.entries(totals)
      .map(([resourceId, amount]) => ({ resourceId, amount }))
      .find((r) => r.resourceId === key)

    return value <= targetResource ? targetResource.amount : 0
  })
}

const useGetTotals = ({ cityId, continentId, planetId }) =>
  useSelector((state) => {
    if (typeof +cityId === 'number') {
      return getCityResourceTotals(+cityId)(state)
    }
    if (typeof +continentId === 'number') {
      return getContinentResourceTotals(+continentId)(state)
    }
    if (typeof +planetId === 'number') {
      return getPlanetResourceTotals(+planetId)(state)
    }
    return getResourceTotals(state)
  })
