import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getUnlocks } from '../../shared/selectors'
import {
  getPlanets,
  getPlanetsSystem,
  getPlanetResourceTotals,
  getPlanetsContinents,
} from '../selectors'
import {
  getContinentResourceTotals,
  getContinentsCities,
} from '../../continent/selectors'
import { explore, settle } from '../../shared/store'
import { Purchase } from '../../shared/components/Purchase'
import { useParams } from 'react-router'
import { Frame, Sidebar } from '../../shared/components/Frame'
import { Resources } from '../../shared/components/Resources'

export const PlanetRoute = () => {
  const { id = '0' } = useParams()
  const planet = useSelector((state) => getPlanets(state, id))
  const continents = useSelector((state) => getPlanetsContinents(state, id))
  const resources = useSelector((state) => getPlanetResourceTotals(state, +id))
  const unlocks = useSelector(getUnlocks)
  const system = useSelector((state) => getPlanetsSystem(state, id))
  if (!planet) {
    return null
  }

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('system') && `#/system/${system.id}`}
          linkText={unlocks.includes('system') && `Back to ${system.label}`}
          label={`Planet: ${planet.label}`}
          resources={resources}
        >
          <span>{planet.type.id}</span>
        </Sidebar>
      }
    >
      <span>Continents:</span>

      <Box display="flex" flexDirection="column">
        {continents
          .filter((c) => c.explored)
          .map((continent) => (
            <ContinentItem key={continent.id} continent={continent} />
          ))}
      </Box>

      {continents.filter((c) => !c.explored).length > 0 && (
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
  const resources = useSelector((state) =>
    getContinentResourceTotals(state, continent.id),
  )
  const cities = useSelector((state) =>
    getContinentsCities(state, continent.id).filter((t) => !!t),
  )
  return (
    <Box my={1} display="flex" alignItems="center">
      <a href={`#/continent/${continent.id}`} style={{ marginRight: 8 }}>
        {continent.label}
      </a>
      <Resources hide resources={resources} />
      {cities.length === 0 && (
        <Purchase
          id="settleContinent"
          action={settle({ continentId: continent.id })}
        />
      )}
    </Box>
  )
}
