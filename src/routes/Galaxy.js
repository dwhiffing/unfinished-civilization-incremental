import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getSystems,
  getResourceTotals,
  getSystemResourceTotals,
} from '../selectors'
import { explore, settle } from '../actions'
import { Purchase } from '../components/Purchase'
import { Totals } from '../components/Totals'

export const Galaxy = () => {
  const systems = useSelector(getSystems)
  const totals = useSelector(getResourceTotals)
  return (
    <Box>
      <Box my={2}>
        <Totals label={`Galaxy`} totals={totals} />
      </Box>

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
    </Box>
  )
}

const SystemItem = ({ system }) => {
  const totals = useSelector(getSystemResourceTotals(system.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/system/${system.id}`} style={{ marginRight: 8 }}>
        {system.label}
      </a>
      <Totals totals={totals} />
      {!system.settled && (
        <Purchase id="settleSystem" action={settle({ systemId: system.id })} />
      )}
    </Box>
  )
}
