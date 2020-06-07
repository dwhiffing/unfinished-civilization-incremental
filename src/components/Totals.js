import React from 'react'
import { Box } from '@material-ui/core'
import { ResourceText } from './Resources'
export const Totals = ({ totals, label = 'Resources:' }) =>
  Object.keys(totals).length > 0 && (
    <Box display="flex" alignItems="center">
      <Box mr={1}>{label}</Box>
      {Object.entries(totals)
        .map(([k, v]) => ({ resourceId: k, amount: v }))
        .map((r, i) => (
          <ResourceText key={i} resource={r} />
        ))}
    </Box>
  )
