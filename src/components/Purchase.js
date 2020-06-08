import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import {
  getBuyables,
  getContinentResourceTotals,
  getPlanetResourceTotals,
  getCityResourceTotals,
  getResourceTotals,
  getSystemResourceTotals,
} from '../selectors'
import { updateResource } from '../actions'

export const Purchase = ({ id, action, disabled, ...ids }) => {
  const dispatch = useDispatch()
  const buyables = useSelector(getBuyables)
  const buyable = buyables.find((b) => b.id === id)
  const isAffordable = useGetIsAffordable({ buyable, ...ids })
  if (!buyable) {
    return null
  }
  const cost = JSON.stringify(buyable.cost)
    .replace(/"/g, '')
    .replace(/\{|\}/g, '')

  const attemptPurchase = async () => {
    if (!disabled && isAffordable) {
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
      style={{ display: 'block', opacity: !disabled && isAffordable ? 1 : 0.5 }}
    >
      {buyable.label} ({cost})
    </Button>
  )
}

const useGetIsAffordable = ({ buyable, ...ids }) => {
  const totals = useGetTotals(ids)
  if (!buyable) return false
  return Object.entries(buyable.cost).every(([key, value]) => {
    const targetResource = Object.entries(totals)
      .map(([resourceId, amount]) => ({ resourceId, amount }))
      .find((r) => r.resourceId === key)

    if (!targetResource) {
      return false
    }

    return value <= targetResource.amount ? targetResource.amount : 0
  })
}

const useGetTotals = ({ cityId, continentId, planetId, systemId }) =>
  useSelector((state) => {
    if (typeof cityId === 'number') {
      return getCityResourceTotals(+cityId)(state)
    }
    if (typeof continentId === 'number') {
      return getContinentResourceTotals(+continentId)(state)
    }
    if (typeof planetId === 'number') {
      return getPlanetResourceTotals(+planetId)(state)
    }
    if (typeof systemId === 'number') {
      return getSystemResourceTotals(+systemId)(state)
    }

    return getResourceTotals(state)
  })
