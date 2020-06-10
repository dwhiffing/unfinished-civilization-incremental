import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import {
  getPlanets,
  getPlanetResourceTotals,
  getContinentResourceTotals,
  getUnlocks,
} from '../selectors'
import { explore, settle } from '../actions'
import { Purchase } from '../components/Purchase'
import { useParams } from 'react-router'
import { Frame, Sidebar } from '../components/Frame'
import { Resources } from '../components/Resources'

export const Planet = () => {
  const { id = '0' } = useParams()
  const planets = useSelector(getPlanets)
  const resources = useSelector(getPlanetResourceTotals(+id))
  const unlocks = useSelector(getUnlocks)
  const planet = planets.find((c) => `${c.id}` === id)
  if (!planet) {
    return null
  }

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('system') && `#/system/${planet.system.id}`}
          linkText={
            unlocks.includes('system') && `Back to ${planet.system.label}`
          }
          label={`Planet: ${planet.label}`}
          resources={resources}
        >
          <span>{planet.type.id}</span>
        </Sidebar>
      }
    >
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
    </Frame>
  )
}

const ContinentItem = ({ continent }) => {
  const resources = useSelector(getContinentResourceTotals(continent.id))
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/continent/${continent.id}`} style={{ marginRight: 8 }}>
        {continent.label}
      </a>
      <Resources hide resources={resources} />
      {!continent.settled && (
        <Purchase
          id="settleContinent"
          action={settle({ continentId: continent.id })}
        />
      )}
    </Box>
  )
}
