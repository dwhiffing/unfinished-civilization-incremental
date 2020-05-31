import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getNations, getNationResourceTotals } from '../selectors'
import { Purchase } from '../components/Purchase'
import { createCity } from '../actions'
import { useParams } from 'react-router'

export const Nation = () => {
  const { id } = useParams()
  const nations = useSelector(getNations)
  const totals = useSelector(getNationResourceTotals(id))
  const nation = nations.find((c) => `${c.id}` === id)
  if (!nation) {
    return null
  }
  const cities = nation.cities

  return (
    <Box>
      <a href={`#/`}>Back to Planet</a>
      <p>Nation: {nation.label}</p>
      <p>
        Resource Totals:
        {Object.entries(totals).reduce(
          (sum, [key, value]) => sum + ` ${key}: ${value} `,
          '',
        )}
      </p>

      <br />

      <span>Cities:</span>

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

      <Purchase
        nationId={id}
        id="buyCity"
        action={createCity({ nationId: nation.id })}
      />
    </Box>
  )
}
