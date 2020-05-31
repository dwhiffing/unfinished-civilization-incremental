import React from 'react'
import numeral from 'numeral'
import { Box, Typography } from '@material-ui/core'
import { getResources } from '../selectors'
import { useSelector } from 'react-redux'

export const Resources = () => {
  const resources = useSelector((state) => getResources(state))

  return (
    <Box className="flex flex-column" my={1}>
      {resources.map((resource) => (
        <Box key={resource.id} display="flex" flexDirection="row" mt={1}>
          <Box>
            <Typography style={{ color: 'black' }}>{resource.id}:</Typography>
          </Box>
          <Box ml={1}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography>
                {numeral(resource.value).format('0,0.00')}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
