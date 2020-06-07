import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getPlanets,
  getResourceTotals,
  getPlanetResourceTotals,
} from '../selectors'
import { explore, settle } from '../actions'
import { Purchase } from '../components/Purchase'
import { Totals } from '../components/Totals'

export const System = () => {
  const planets = useSelector(getPlanets)
  const totals = useSelector(getResourceTotals)
  return (
    <Box>
      <Box my={2}>
        <Totals label={`System: Solar`} totals={totals} />
      </Box>

      <span>Planets:</span>

      <Box display="flex" flexDirection="column">
        {planets
          .filter((p) => p.explored)
          .map((planet) => (
            <PlanetItem key={planet.id} planet={planet} />
          ))}
      </Box>

      {planets.filter((p) => !p.explored).length > 0 && (
        <Purchase id="exploreContinent" action={explore()} />
      )}
    </Box>
  )
}

const PlanetItem = ({ planet }) => {
  const totals = useSelector(getPlanetResourceTotals(planet.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/planet/${planet.id}`} style={{ marginRight: 8 }}>
        {planet.label}
      </a>
      <Totals totals={totals} />
      {!planet.settled && (
        <Purchase id="settlePlanet" action={settle({ planetId: planet.id })} />
      )}
    </Box>
  )
}
