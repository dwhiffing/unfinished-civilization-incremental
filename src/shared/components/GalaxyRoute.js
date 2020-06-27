import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getSystems, getSystemsCities } from '../../system/selectors'
import { explore, settle } from '../store'
import { Purchase } from './Purchase'

export const GalaxyRoute = () => {
  const systems = useSelector(getSystems)
  return (
    <>
      <span>Systems:</span>

      <Box display="flex" flexDirection="column">
        {systems
          .filter((p) => p.explored)
          .map((system) => (
            <SystemItem key={system.id} system={system} />
          ))}
      </Box>

      {systems.filter((p) => !p.explored).length > 0 && (
        <Purchase id="exploreGalaxy" action={explore()} />
      )}
    </>
  )
}

const SystemItem = ({ system }) => {
  const cities = useSelector((state) => getSystemsCities(state, system.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/system/${system.id}`} style={{ marginRight: 8 }}>
        {system.label}
      </a>
      {cities.length === 0 && (
        <Purchase id="settleSystem" action={settle({ systemId: system.id })} />
      )}
    </Box>
  )
}
