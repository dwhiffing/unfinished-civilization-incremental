import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getSystems,
  getSystemResourceTotals,
  getPlanetResourceTotals,
  getUnlocks,
} from '../shared/selectors'
import { explore, settle } from '../shared/store'
import { Purchase } from '../shared/components/Purchase'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../shared/components/Frame'
import { Resources } from '../shared/components/Resources'

export const System = () => {
  const { id = '0' } = useParams()
  const systems = useSelector(getSystems)
  const system = systems.find((c) => `${c.id}` === id)
  const resources = useSelector(getSystemResourceTotals(+id))
  const unlocks = useSelector(getUnlocks)
  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('galaxy') && `#/`}
          linkText={unlocks.includes('galaxy') && `Back to Galaxy`}
          label={`System: ${system.label}`}
          resources={resources}
        />
      }
    >
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
    </Frame>
  )
}

const PlanetItem = ({ planet }) => {
  const resources = useSelector(getPlanetResourceTotals(planet.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/planet/${planet.id}`} style={{ marginRight: 8 }}>
        {planet.label}
      </a>
      <Resources hide resources={resources} />
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
