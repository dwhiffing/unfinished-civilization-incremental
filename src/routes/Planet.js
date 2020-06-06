import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getPlanets,
  getPlanetResourceTotals,
  getContinentResourceTotals,
} from '../selectors'
import { createContinent } from '../actions'
import { Purchase } from '../components/Purchase'
import { useParams } from 'react-router'
import { Totals } from '../components/Totals'

export const Planet = () => {
  const { id } = useParams()
  const planets = useSelector(getPlanets)
  const totals = useSelector(getPlanetResourceTotals(id))
  const planet = planets.find((c) => `${c.id}` === id)
  if (!planet) {
    return null
  }
  return (
    <Box>
      <a href={`#/`}>Back to System</a>
      <br />
      <p>Planet: {planet.label}</p>

      <Totals totals={totals} />

      <br />
      <span>Continents:</span>

      <Box display="flex" flexDirection="column">
        {planet.continents.map((continent) => (
          <ContinentItem key={continent.id} continent={continent} />
        ))}
      </Box>

      <Purchase
        planetId={id}
        id="buyContinent"
        action={createContinent({ planetId: planet.id })}
      />
    </Box>
  )
}

const ContinentItem = ({ continent }) => {
  const totals = useSelector(getContinentResourceTotals(`${continent.id}`))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/continent/${continent.id}`} style={{ marginRight: 8 }}>
        {continent.label}
      </a>
      <Totals totals={totals} />
    </Box>
  )
}
