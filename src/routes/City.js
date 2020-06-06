import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { Resources } from '../components/Resources'
import { Buildings } from '../components/Buildings'
import { People } from '../components/People'
import { getCities } from '../selectors'
import { useParams } from 'react-router'

export const City = () => {
  const { id } = useParams()
  const cities = useSelector(getCities)
  const city = cities.find((c) => `${c.id}` === id)
  if (!city) {
    return null
  }
  const continentId = city.continent.id

  return (
    <Box display="flex" flexDirection="row" minHeight="100vh">
      <Box display="flex" flexDirection="column" flex={1} p={1}>
        <a href={`#/continent/${continentId}`}>
          Back to {city.continent.label}
        </a>
        <br />
        <span>{city.label}</span>
        <Resources continentId={continentId} resources={city.resources} />
        <People
          continentId={continentId}
          cityId={city.id}
          people={city.people}
        />
      </Box>
      <Box flex={3} p={1}>
        <Buildings
          continentId={continentId}
          cityId={city.id}
          buildings={city.buildings}
        />
      </Box>
    </Box>
  )
}
