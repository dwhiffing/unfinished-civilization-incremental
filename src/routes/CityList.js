import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getCities } from '../selectors'

export const CityList = () => {
  const cities = useSelector(getCities)

  return (
    <Box>
      <p>Cities</p>
      <Box display="flex" flexDirection="column">
        {cities.map((c) => (
          <div key={c.id}>
            <a href={`#/city/${c.id}`}>{c.id}</a>
          </div>
        ))}
      </Box>
    </Box>
  )
}
