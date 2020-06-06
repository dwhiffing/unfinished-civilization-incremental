import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getContinents, getContinentResourceTotals } from '../selectors'
import { Purchase } from '../components/Purchase'
import { createCity } from '../actions'
import { useParams } from 'react-router'
import { ResourceText } from '../components/Resources'
import { Totals } from '../components/Totals'

export const Continent = () => {
  const { id } = useParams()
  const continent = useSelector(getContinents).find((c) => `${c.id}` === id)
  const totals = useSelector(getContinentResourceTotals(id))

  if (!continent) {
    return null
  }

  return (
    <Box>
      <a href={`#/planet/${continent.planet.id}`}>
        Back to {continent.planet.label}
      </a>
      <p>Continent: {continent.label}</p>

      <Totals totals={totals} />

      <br />

      <span>Cities:</span>

      <Box display="flex" flexDirection="column">
        {continent.cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </Box>

      <Purchase
        continentId={id}
        id="buyCity"
        action={createCity({ continentId: continent.id })}
      />
    </Box>
  )
}

const CityItem = ({ city }) => (
  <Box my={1} display="flex" alignItems="center">
    <a
      href={`#/city/${city.id}`}
      style={{
        marginRight: 8,
      }}
    >
      {city.label}
    </a>
    <Box display="flex">
      {city.resources.map((r, i) => (
        <ResourceText key={i} resource={r} />
      ))}
    </Box>
  </Box>
)
