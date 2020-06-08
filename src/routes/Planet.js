import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getPlanets,
  getPlanetResourceTotals,
  getContinentResourceTotals,
} from '../selectors'
import { explore, settle } from '../actions'
import { Purchase } from '../components/Purchase'
import { useParams } from 'react-router'
import { Totals } from '../components/Totals'

export const Planet = () => {
  const { id } = useParams()
  const planets = useSelector(getPlanets)
  const totals = useSelector(getPlanetResourceTotals(+id))
  const planet = planets.find((c) => `${c.id}` === id)
  if (!planet) {
    return null
  }
  return (
    <Box>
      <a href={`#/system/${planet.system.id}`}>Back to System</a>
      <Box my={2}>
        <Totals label={`Planet: ${planet.label}`} totals={totals} />
      </Box>

      <span>Continents:</span>

      <Box display="flex" flexDirection="column">
        {planet.continents
          .filter((c) => c.explored)
          .map((continent) => (
            <ContinentItem key={continent.id} continent={continent} />
          ))}
      </Box>

      {planet.continents.filter((c) => !c.explored).length > 0 && (
        <Purchase
          planetId={+id}
          id="explorePlanet"
          action={explore({ planetId: planet.id })}
        />
      )}
    </Box>
  )
}

const ContinentItem = ({ continent }) => {
  const totals = useSelector(getContinentResourceTotals(continent.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/continent/${continent.id}`} style={{ marginRight: 8 }}>
        {continent.label}
      </a>
      <Totals totals={totals} />
      {!continent.settled && (
        <Purchase
          id="settleContinent"
          action={settle({ continentId: continent.id })}
        />
      )}
    </Box>
  )
}
