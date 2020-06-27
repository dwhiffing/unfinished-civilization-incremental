import React from 'react'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { Sidebar } from '../../shared/components/Frame'
import { useParams } from 'react-router'
import { getCityFull } from '../selectors'
import mapValues from 'lodash/mapValues'
import { resources } from '../../shared/data/resources'

export const CitySidebar = () => {
  const { id = '0' } = useParams()
  const unlocks = useSelector(getUnlocks)
  const city = useSelector((state) => getCityFull(state, id))
  if (!city || !city.continent) return false

  const numPeople = city.people.length
  return (
    <Sidebar
      uri={unlocks.includes('continent') && `#/continent/${city.continent.id}`}
      linkText={
        unlocks.includes('continent') && `Back to ${city.continent.label}`
      }
      label={`City: ${city.label}`}
      resources={city.resources}
      resourceChange={city.resourceChange}
      resourceTooltips={getResourceTooltipsForCity(city)}
    >
      <span>biome: {city.plot.biome}</span>
      <span>
        housing: {numPeople}/{city.housing}
      </span>
    </Sidebar>
  )
}

function getResourceTooltipsForCity(city) {
  return mapValues(
    resources.map((r) => r.id).reduce((obj, n) => ({ ...obj, [n]: {} }), {}),
    (value, resourceId) => {
      const change = city.resourceChange
      const gain = change.gain[resourceId] || 0
      const drain = change.drain[resourceId] || 0
      const subtotal = change.subtotal[resourceId] || 0
      const penalty = change.modifiers[resourceId]
        ? (1 - change.modifiers[resourceId]) * 100
        : 0
      const final = change.total[resourceId] || 0

      const displayValue = (value) => `${value > 0 ? '+' : ''}${value}/sec`

      return `
            gain: ${displayValue(gain)}<br>
            drain: ${displayValue(drain)}<br>
            subtotal: ${displayValue(subtotal)}<br>
            penalty: -${penalty}%<br>
            final: ${displayValue(final)}<br>
          `
    },
  )
}
