import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getCities, getResourceTotals } from '../selectors'
import { Purchase } from '../components/Purchase'
import { createCity } from '../actions'

export const CityList = () => {
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
      {/* wont work until purchase can use total resources instead */}
      <Purchase id="buyCity" action={createCity()} />
    </Box>
  )
}
