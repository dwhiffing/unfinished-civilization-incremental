import React from 'react'
import numeral from 'numeral'
import { Box, Typography } from '@material-ui/core'

export const ResourceText = ({ resource }) => (
  <>
    <Box>
      <Typography style={{ color: 'black' }}>{resource.resourceId}:</Typography>
    </Box>
    <Box mr={1} display="flex" flexDirection="row" alignItems="center">
      <Typography>{numeral(resource.amount).format('0,0')}</Typography>
    </Box>
  </>
)

export const Resources = ({ resources }) => {
  return (
    <Box className="flex flex-column" my={1}>
      {resources.map((resource) => (
        <Box
          key={resource.resourceId}
          display="flex"
          flexDirection="row"
          mt={1}
        >
          <ResourceText resource={resource} />
        </Box>
      ))}
    </Box>
  )
}
