import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { getContinentResourceTotals } from '../../continent/selectors'
import { getBuyables, getResourceTotals } from '../selectors'
import { getPlanetResourceTotals } from '../../planet/selectors'
import { getSystemResourceTotals } from '../../system/selectors'
import { getCityResourceTotals } from '../../city/selectors'
import { updateResource } from '../store'

export const Purchase = ({ id, label, action, disabled, ...ids }) => {
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
          dispatch(
            updateResource({
              resourceId,
              value: -value,
              id: ids.cityId,
              ...ids,
              cityId: null,
            }),
          ),
        ),
      )
      await dispatch(action)
    }
  }

  return (
    <Button
      color="primary"
      onClick={attemptPurchase}
      style={{ display: 'block', opacity: !disabled && isAffordable ? 1 : 0.5 }}
    >
      {label || buyable.label} ({cost})
    </Button>
  )
}

const useGetIsAffordable = ({ buyable, ...ids }) => {
  const totals = useGetTotals(ids)
  if (!buyable) return false
  return Object.entries(buyable.cost).every(([key, value]) => {
    const targetResource = Object.entries(totals)
      .map(([resourceId, { amount }]) => ({ resourceId, amount: amount }))
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
      return getCityResourceTotals(state, +cityId)
    }
    if (typeof continentId === 'number') {
      return getContinentResourceTotals(state, +continentId)
    }
    if (typeof planetId === 'number') {
      return getPlanetResourceTotals(state, +planetId)
    }
    if (typeof systemId === 'number') {
      return getSystemResourceTotals(state, +systemId)
    }

    return getResourceTotals(state)
  })
