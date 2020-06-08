import React from 'react'
import { Box } from '@material-ui/core'
import { Resources } from './Resources'
export const Frame = ({ children, sidebar }) => (
  <Box display="flex">
    <Box display="flex" flexDirection="column" flex={1} minWidth={150} p={1}>
      {sidebar}
    </Box>
    <Box flex={2} p={1}>
      {children}
    </Box>
  </Box>
)

export const Sidebar = ({ label, resources, linkText, uri }) => (
  <>
    {uri ? <a href={uri}>{linkText}</a> : <br />}
    <br />
    <span>{label}</span>
    <Resources resources={resources} />
  </>
)
