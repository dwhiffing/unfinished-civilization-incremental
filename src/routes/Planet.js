import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getContinents, getPlanetResourceTotals } from '../selectors'
import { createContinent } from '../actions'
import { Purchase } from '../components/Purchase'

export const Planet = () => {
  const continents = useSelector(getContinents)
  const totals = useSelector(getPlanetResourceTotals)
  return (
    <Box>
      <br />
      <p>Planet: Earth</p>
      <p>
        Resource Totals:
        {Object.entries(totals).reduce(
          (sum, [key, value]) => sum + ` ${key}: ${value} `,
          '',
        )}
      </p>
      <br />
      <span>Continents:</span>

      <Box display="flex" flexDirection="column">
        {continents.map((c) => {
          const things = c.cities.map((c) => c.resources).flat()
          return (
            <Box my={1} key={c.id} display="flex" alignItems="center">
              <a href={`#/continent/${c.id}`} style={{ marginRight: 8 }}>
                {c.label}
              </a>
              <span key={`resource-${c.id}`}>
                {Object.entries(
                  things.reduce((sum, r) => {
                    sum[r.resourceId] = sum[r.resourceId] || 0
                    sum[r.resourceId] += r.amount
                    return sum
                  }, {}),
                ).reduce((sum, [key, value]) => sum + `${key}: ${value} `, '')}
              </span>
            </Box>
          )
        })}
      </Box>

      <Purchase id="buyContinent" action={createContinent()} />
    </Box>
  )
}
