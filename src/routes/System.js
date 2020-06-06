import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getPlanets, getResourceTotals } from '../selectors'
import { createPlanet } from '../actions'
import { Purchase } from '../components/Purchase'

export const System = () => {
  const planets = useSelector(getPlanets)
  const totals = useSelector(getResourceTotals)
  return (
    <Box>
      <br />
      <p>System: Solar</p>
      <p>
        Resource Totals:
        {Object.entries(totals).reduce(
          (sum, [key, value]) => sum + ` ${key}: ${value} `,
          '',
        )}
      </p>
      <br />
      <span>Planets:</span>

      <Box display="flex" flexDirection="column">
        {planets.map((c) => {
          const things = c.continents
            .map((c) => c.cities.map((c) => c.resources).flat())
            .flat()
          return (
            <Box my={1} key={c.id} display="flex" alignItems="center">
              <a href={`#/planet/${c.id}`} style={{ marginRight: 8 }}>
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

      <Purchase id="buyPlanet" action={createPlanet()} />
    </Box>
  )
}
