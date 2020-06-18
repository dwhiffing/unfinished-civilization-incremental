import React from 'react'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { Sidebar } from '../../shared/components/Frame'
import { useParams } from 'react-router'
import { getCityFull } from '../selectors'
import { FOOD_DRAIN } from '../../shared/data'
import { getResourceModifiers } from '../store/getCityResourceChange'
export const CitySidebar = () => {
  const { id = '0' } = useParams()
  const unlocks = useSelector(getUnlocks)
  const city = useSelector((state) => getCityFull(state, id))
  if (!city || !city.continent) return false

  return (
    <Sidebar
      uri={unlocks.includes('continent') && `#/continent/${city.continent.id}`}
      linkText={
        unlocks.includes('continent') && `Back to ${city.continent.label}`
      }
      label={`City: ${city.label}`}
      resources={city.resources}
      resourceChange={city.resourceChange}
    >
      <span>biome: {city.plot.biome}</span>
      <span>
        housing: {city.people.length}/{city.housing}
      </span>
      <span>food gain: {city.resourceChange.gain.food}/sec</span>
      <span>food drain: -{city.people.length * FOOD_DRAIN}/sec</span>
      <span>
        subtotal:{' '}
        {city.resourceChange.gain.food - city.people.length * FOOD_DRAIN}/sec
      </span>
      <span>
        housing penalty: -
        {(1 -
          getResourceModifiers({ ...city, numPeople: city.people.length })
            .food) *
          100}
        %
      </span>
    </Sidebar>
  )
}
