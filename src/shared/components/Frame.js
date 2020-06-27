import React from 'react'
import { Box } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { Resources, ResourceText } from './Resources'
import { getStockpiles } from '../../city/selectors'

export const Frame = ({ children, sidebar }) => {
  const stockpiles = useSelector((state) => getStockpiles(state)).filter(
    (s) => s.type === 'global',
  )
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        {stockpiles.map((resource) => (
          <ResourceText key={resource.id} resource={resource} />
        ))}
      </Box>

      <Box display="flex">
        <Box
          display="flex"
          flexDirection="column"
          flex={3}
          minWidth={150}
          p={1}
        >
          {sidebar}
        </Box>
        <Box flex={7} p={1}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export const Sidebar = ({
  label,
  resources,
  resourceChange,
  linkText,
  uri,
  children,
}) => (
  <>
    {uri ? <a href={uri}>{linkText}</a> : <br />}
    <br />
    <span>{label}</span>
    {children}
    <Resources resourceChange={resourceChange} resources={resources} />
  </>
)
