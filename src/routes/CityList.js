import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button } from '@material-ui/core'
import { getCities, getResourceTotals } from '../selectors'

export const CityList = () => {
  const dispatch = useDispatch()
  const cities = useSelector(getCities)
  const totals = useSelector(getResourceTotals)
  return (
    <Box>
      <p>Totals</p>
      {Object.entries(totals).reduce(
        (sum, [key, value]) => sum + ` ${key}: ${value} `,
        '',
      )}
      <p>Cities</p>

      <Box display="flex" flexDirection="column">
        {cities.map((c) => (
          <Box my={1} key={c.id} display="flex" alignItems="center">
            <a href={`#/city/${c.id}`} style={{ marginRight: 8 }}>
              {c.label}
            </a>
            <span>
              {c.resources.reduce(
                (sum, r) => sum + `${r.resourceId}: ${r.amount} `,
                '',
              )}
            </span>
          </Box>
        ))}
      </Box>

      <Button onClick={() => dispatch({ type: 'CREATE_CITY' })}>Create</Button>
    </Box>
  )
}
