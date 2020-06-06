import React from 'react'
import { Box } from '@material-ui/core'
import { ResourceText } from './Resources'
export const Totals = (props) => (
  <Box display="flex" alignItems="center">
    <Box mr={1}>Resources:</Box>
    {Object.entries(props.totals)
      .map(([k, v]) => ({ resourceId: k, amount: v }))
      .map((r, i) => (
        <ResourceText key={i} resource={r} />
      ))}
  </Box>
)
