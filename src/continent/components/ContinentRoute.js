import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@material-ui/core'
import { getUnlocks } from '../../shared/selectors'
import {
  getContinentResourceTotals,
  getContinentsPlanet,
  getContinentsCities,
  getContinentsPlots,
  getContinents,
} from '../selectors'
import { Purchase } from '../../shared/components/Purchase'
import { explore } from '../../shared/store'
import { createCity } from '../../city/store'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../../shared/components/Frame'
import { Resources } from '../../shared/components/Resources'

export const ContinentRoute = () => {
  const { id = '0' } = useParams()
  const continent = useSelector((state) => getContinents(state, +id))
  const planet = useSelector((state) => getContinentsPlanet(state, +id))
  const cities = useSelector((state) =>
    getContinentsCities(state, +id).filter((t) => !!t),
  )
  const plots = useSelector((state) => getContinentsPlots(state, +id))
  const resources = useSelector((state) =>
    getContinentResourceTotals(state, +id),
  )
  const unlocks = useSelector(getUnlocks)

  if (!continent) {
    return null
  }

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('planet') && `#/planet/${planet.id}`}
          linkText={unlocks.includes('planet') && `Back to ${planet.label}`}
          label={`Continent: ${continent.label}`}
          resources={resources}
        />
      }
    >
      <span>Cities:</span>

      <Box display="flex" flexDirection="column">
        {cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </Box>

      {plots
        .filter((p) => typeof p.cityId !== 'number' && p.explored)
        .map((plot) => (
          <Box key={`${plot.id}-explore`} display="flex" alignItems="center">
            <Purchase
              continentId={+id}
              id="buyCity"
              action={createCity({ plotId: plot.id })}
            />
            <Typography>{plot.biome}</Typography>
          </Box>
        ))}

      {plots.filter((p) => !p.city && !p.explored).length > 0 && (
        <Purchase
          continentId={+id}
          id="exploreContinent"
          action={explore({ continentId: continent.id })}
        />
      )}
    </Frame>
  )
}

const CityItem = ({ city }) => (
  <Box my={1} display="flex" alignItems="center">
    <a
      href={`#/city/${city.id}`}
      style={{
        marginRight: 8,
      }}
    >
      {city.label}
    </a>
    <Resources hide resources={city.stockpiles} />
  </Box>
)
