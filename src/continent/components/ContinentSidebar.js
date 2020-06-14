import React from 'react'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { Sidebar } from '../../shared/components/Frame'
import { useParams } from 'react-router'
import { getContinentFull } from '../selectors'
export const ContinentSidebar = () => {
  const { id = '0' } = useParams()
  const continent = useSelector((state) => getContinentFull(state, id))
  const unlocks = useSelector(getUnlocks)
  return (
    <Sidebar
      uri={unlocks.includes('planet') && `#/planet/${continent.planet.id}`}
      linkText={
        unlocks.includes('planet') && `Back to ${continent.planet.label}`
      }
      label={`Continent: ${continent.label}`}
      resources={continent.resources}
    />
  )
}
