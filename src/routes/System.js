import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getPlanetResourceTotals,
  getSystems,
  getSystemResourceTotals,
} from '../selectors'
import { explore, settle } from '../actions'
import { Purchase } from '../components/Purchase'
import { Totals } from '../components/Totals'
import { useParams } from 'react-router'

export const System = () => {
  const { id } = useParams()
  const systems = useSelector(getSystems)
  const system = systems.find((c) => `${c.id}` === id)
  const totals = useSelector(getSystemResourceTotals(+id))
  return (
    <Box>
      <a href={`#/`}>Back to Galaxy</a>

      <Box my={2}>
        <Totals label={`System: ${system.label}`} totals={totals} />
      </Box>

      <span>Planets:</span>

      <Box display="flex" flexDirection="column">
        {system.planets
          .filter((p) => p.explored)
          .map((planet) => (
            <PlanetItem key={planet.id} planet={planet} />
          ))}
      </Box>

      {system.planets.filter((p) => !p.explored).length > 0 && (
        <Purchase
          systemId={system.id}
          id="exploreContinent"
          action={explore({ systemId: system.id })}
        />
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
        <Purchase
          systemId={planet.system.id}
          id="settlePlanet"
          action={settle({ planetId: planet.id })}
        />
      )}
    </Box>
  )
}
