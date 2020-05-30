import React from 'react'
import numeral from 'numeral'
import { Box, Typography } from '@material-ui/core'

export const Resources = ({ resources }) => (
  <div className="flex flex-column">
    {Object.values(resources).map((resource) => (
      <Box key={resource.label} display="flex" flexDirection="row" mt={1}>
        <Box>
          <Typography style={{ color: 'black' }}>{resource.label}:</Typography>
        </Box>
        <Box ml={1}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography>{numeral(resource.value).format('0,0.00')}</Typography>
          </Box>
        </Box>
      </Box>
    ))}
  </div>
)
