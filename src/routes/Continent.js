import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getContinents, getContinentResourceTotals } from '../selectors'
import { Purchase } from '../components/Purchase'
import { createCity } from '../actions'
import { useParams } from 'react-router'

export const Continent = () => {
  const { id } = useParams()
  const continents = useSelector(getContinents)
  const totals = useSelector(getContinentResourceTotals(id))
  const continent = continents.find((c) => `${c.id}` === id)
  if (!continent) {
    return null
  }
  const cities = continent.cities

  return (
    <Box>
      <a href={`#/planet/${continent.planet.id}`}>
        Back to {continent.planet.label}
      </a>
      <p>Continent: {continent.label}</p>
      <p>
        Resource Totals:
        {Object.entries(totals).reduce(
          (sum, [key, value]) => sum + ` ${key}: ${value} `,
          '',
        )}
      </p>

      <br />

      <span>Cities:</span>

      <Box display="flex" flexDirection="column">
        {cities.map((c) => (
          <Box my={1} key={c.id} display="flex" alignItems="center">
            <a href={`#/city/${c.id}`} style={{ marginRight: 8 }}>
              {c.label}
            </a>
            <span>
              {c.resources.reduce(
                (sum, r) => sum + `${r.resourceId}: ${r.amount} `,
                '',
              )}
            </span>
          </Box>
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
