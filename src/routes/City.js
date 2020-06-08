import React from 'react'
import { useSelector } from 'react-redux'
import { Buildings } from '../components/Buildings'
import { People } from '../components/People'
import { getCities } from '../selectors'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../components/Frame'
// TODO: Add actions to allow citizens to all be assigned/deassigned

export const City = () => {
  const { id } = useParams()
  const cities = useSelector(getCities)
  const city = cities.find((c) => `${c.id}` === id)
  if (!city) {
    return null
  }
  const continentId = city.continent.id

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={`#/continent/${continentId}`}
          linkText={`Back to ${city.continent.label}`}
          label={`City: ${city.label}`}
          resources={city.resources}
        />
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
