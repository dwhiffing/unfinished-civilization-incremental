import React from 'react'
import { Box } from '@material-ui/core'
import { Resources } from './Resources'
export const Frame = ({ children, sidebar }) => (
  <Box display="flex">
    <Box display="flex" flexDirection="column" flex={2} minWidth={150} p={1}>
      {sidebar}
    </Box>
    <Box flex={7} p={1}>
      {children}
    </Box>
  </Box>
)

export const Sidebar = ({ label, resources, linkText, uri, children }) => (
  <>
    {uri ? <a href={uri}>{linkText}</a> : <br />}
    <br />
    <span>{label}</span>
    {children}
    <Resources resources={resources} />
  </>
)
