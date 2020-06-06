import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getPlanets,
  getResourceTotals,
  getPlanetResourceTotals,
} from '../selectors'
import { createPlanet } from '../actions'
import { Purchase } from '../components/Purchase'
import { Totals } from '../components/Totals'

export const System = () => {
  const planets = useSelector(getPlanets)
  const totals = useSelector(getResourceTotals)
  return (
    <Box>
      <br />
      <p>System: Solar</p>

      <Totals totals={totals} />

      <br />
      <span>Planets:</span>

      <Box display="flex" flexDirection="column">
        {planets.map((planet) => (
          <PlanetItem key={planet.id} planet={planet} />
        ))}
      </Box>

      <Purchase id="buyPlanet" action={createPlanet()} />
    </Box>
  )
}

const PlanetItem = ({ planet }) => {
  const totals = useSelector(getPlanetResourceTotals(`${planet.id}`))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/planet/${planet.id}`} style={{ marginRight: 8 }}>
        {planet.label}
      </a>
      <Totals totals={totals} />
    </Box>
  )
}
