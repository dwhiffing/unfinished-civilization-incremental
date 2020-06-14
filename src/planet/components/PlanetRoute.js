import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getPlanetFull } from '../selectors'
import {
  getContinentResourceTotals,
  getContinentsCities,
} from '../../continent/selectors'
import { explore, settle } from '../../shared/store'
import { Purchase } from '../../shared/components/Purchase'
import { useParams } from 'react-router'
import { Resources } from '../../shared/components/Resources'

export const PlanetRoute = () => {
  const { id = '0' } = useParams()
  const planet = useSelector((state) => getPlanetFull(state, id))
  if (!planet || !planet.system) {
    return null
  }

  return (
    <>
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
    </>
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
