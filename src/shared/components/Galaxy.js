import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getSystems,
  getResourceTotals,
  getSystemResourceTotals,
} from '../selectors'
import { explore, settle } from '../store'
import { Purchase } from './Purchase'
import { Frame, Sidebar } from './Frame'
import { Resources } from './Resources'

export const Galaxy = () => {
  const systems = useSelector(getSystems)
  const resources = useSelector(getResourceTotals)
  return (
    <Frame sidebar={<Sidebar label="Galaxy" resources={resources} />}>
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
    </Frame>
  )
}

const SystemItem = ({ system }) => {
  const resources = useSelector(getSystemResourceTotals(system.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/system/${system.id}`} style={{ marginRight: 8 }}>
        {system.label}
      </a>
      <Resources hide resources={resources} />
      {!system.settled && (
        <Purchase id="settleSystem" action={settle({ systemId: system.id })} />
      )}
    </Box>
  )
}
