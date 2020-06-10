import React from 'react'
import { useSelector } from 'react-redux'
import { Buildings } from '../components/Buildings'
import { People } from '../components/People'
import { getCities, getUnlocks } from '../selectors'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../components/Frame'
// TODO: Add actions to allow citizens to all be assigned/deassigned

export const City = () => {
  const { id = '0' } = useParams()
  const cities = useSelector(getCities)
  const unlocks = useSelector(getUnlocks)
  const city = cities.find((c) => `${c.id}` === id)
  if (!city) {
    return null
  }
  const continentId = city.continent.id

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('continent') && `#/continent/${continentId}`}
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
      <People continentId={continentId} cityId={city.id} people={city.people} />

      <Buildings
        continentId={continentId}
        cityId={city.id}
        buildings={city.buildings}
      />
    </Frame>
  )
}
