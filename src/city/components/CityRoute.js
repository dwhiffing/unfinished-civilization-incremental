import React from 'react'
import { useSelector } from 'react-redux'
import { Districts } from './Districts'
import { People } from './People'
import { getCityFull } from '../selectors'
import { getUnlocks } from '../../shared/selectors'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../../shared/components/Frame'

export const CityRoute = () => {
  const { id = '0' } = useParams()
  const city = useSelector((state) => getCityFull(state, +id))
  const unlocks = useSelector(getUnlocks)

  if (!city || !city.continent) {
    return null
  }

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={
            unlocks.includes('continent') && `#/continent/${city.continent.id}`
          }
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
      }
    >
      <People people={city.people} />

      <Districts
        continentId={city.continent.id}
        cityId={city.id}
        districts={city.districts}
      />
    </Frame>
  )
}
