import React from 'react'
import numeral from 'numeral'
import { Box, Typography } from '@material-ui/core'

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
          <Box>
            <Typography style={{ color: 'black' }}>
              {resource.resourceId}:
            </Typography>
          </Box>
          <Box ml={1}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography>
                {numeral(resource.amount).format('0,0.00')}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
