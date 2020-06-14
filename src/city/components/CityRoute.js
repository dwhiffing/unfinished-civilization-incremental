import React from 'react'
import { useSelector } from 'react-redux'
import { Districts } from './Districts'
import { People } from './People'
import {
  getCity,
  getCityContinent,
  getCityPlot,
  getCityResources,
  getCityDistricts,
  getCityPeople,
} from '../selectors'
import { getUnlocks } from '../../shared/selectors'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../../shared/components/Frame'

export const CityRoute = () => {
  const { id = '0' } = useParams()
  const city = useSelector((state) => getCity(state, +id))
  const continent = useSelector((state) => getCityContinent(state, +id))
  const plot = useSelector((state) => getCityPlot(state, +id))
  const people = useSelector((state) => getCityPeople(state, +id))
  const resources = useSelector((state) => getCityResources(state, +id))
  const districts = useSelector((state) => getCityDistricts(state, +id))
  const unlocks = useSelector(getUnlocks)

  if (!city) {
    return null
  }

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('continent') && `#/continent/${continent.id}`}
          linkText={
            unlocks.includes('continent') && `Back to ${continent.label}`
          }
          label={`City: ${city.label}`}
          resources={resources}
        >
          <span>biome: {plot.biome}</span>
          <span>
            housing: {people.length}/{city.housing}
          </span>
        </Sidebar>
      }
    >
      <People people={people} />

      <Districts
        continentId={continent.id}
        cityId={city.id}
        districts={districts}
      />
    </Frame>
  )
}
