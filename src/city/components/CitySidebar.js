import React from 'react'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { Sidebar } from '../../shared/components/Frame'
import { useParams } from 'react-router'
import { getCityFull } from '../selectors'
export const CitySidebar = () => {
  const { id = '0' } = useParams()
  const unlocks = useSelector(getUnlocks)
  const city = useSelector((state) => getCityFull(state, id))
  return (
    <Sidebar
      uri={unlocks.includes('continent') && `#/continent/${city.continent.id}`}
      linkText={
        unlocks.includes('continent') && `Back to ${city.continent.label}`
      }
      label={`City: ${city.label}`}
      resources={city.resources}
    >
      <span>biome: {city.plot.biome}</span>
      <span>
        housing: {city.people.length}/{city.housing}
      </span>
    </Sidebar>
  )
}
