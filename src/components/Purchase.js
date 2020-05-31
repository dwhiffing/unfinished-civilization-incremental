import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { getBuyables, getCities, getResourceTotals } from '../selectors'
import { updateResource } from '../actions'

export const Purchase = ({ id, cityId, action }) => {
  const dispatch = useDispatch()
  const city = useSelector(getCities).find((b) => b.id === cityId)
  const buyable = useSelector(getBuyables).find((b) => b.id === id)
  const totals = useSelector(getResourceTotals)
  const resources = city
    ? city.resources
    : Object.entries(totals).map(([key, value]) => ({
        resourceId: key,
        amount: value,
      }))
  const isAffordable = Object.entries(buyable.cost).every(([key, value]) => {
    const targetResourceAmount = resources.find((r) => r.resourceId === key)
      .amount

    return value <= targetResourceAmount
  })
  const label = buyable.label
  const cost = JSON.stringify(buyable.cost)
  return (
    <Button
      style={{ opacity: isAffordable ? 1 : 0.5 }}
      onClick={async () => {
        if (isAffordable) {
          await Promise.all(
            Object.entries(buyable.cost).map(([key, value]) =>
              dispatch(updateResource(key, -value, cityId)),
            ),
          )
          await dispatch(action)
        }
      }}
    >
      {label} ({cost})
    </Button>
  )
}
