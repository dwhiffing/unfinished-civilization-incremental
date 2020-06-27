import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getSystemFull } from '../selectors'
import { getPlanetsCities } from '../../planet/selectors'
import { explore, settle } from '../../shared/store'
import { Purchase } from '../../shared/components/Purchase'
import { useParams } from 'react-router'

export const SystemRoute = () => {
  const { id = '0' } = useParams()
  const system = useSelector((state) => getSystemFull(state, +id))

  if (!system || !system.resources) {
    return false
  }
  return (
    <>
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
    </>
  )
}

const PlanetItem = ({ planet }) => {
  const cities = useSelector((state) =>
    getPlanetsCities(state, planet.id)
      .flat(5)
      .filter((t) => !!t),
  )
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/planet/${planet.id}`} style={{ marginRight: 8 }}>
        {planet.label}
      </a>
      {cities.length === 0 && (
        <Purchase
          systemId={planet.systemId}
          id="settlePlanet"
          action={settle({ planetId: planet.id })}
        />
      )}
    </Box>
  )
}
