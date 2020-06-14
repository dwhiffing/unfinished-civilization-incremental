import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@material-ui/core'
import { getUnlocks } from '../../shared/selectors'
import { getContinents } from '../../continent/selectors'
import { getContinentResourceTotals } from '../selectors'
import { Purchase } from '../../shared/components/Purchase'
import { explore } from '../../shared/store'
import { createCity } from '../../city/store'
import { useParams } from 'react-router'
import { Sidebar, Frame } from '../../shared/components/Frame'
import { Resources } from '../../shared/components/Resources'

export const ContinentRoute = () => {
  const { id = '0' } = useParams()
  const continent = useSelector(getContinents).find((c) => `${c.id}` === id)
  const resources = useSelector(getContinentResourceTotals(+id))
  const unlocks = useSelector(getUnlocks)

  if (!continent) {
    return null
  }

  return (
    <Frame
      sidebar={
        <Sidebar
          uri={unlocks.includes('planet') && `#/planet/${continent.planet.id}`}
          linkText={
            unlocks.includes('planet') && `Back to ${continent.planet.label}`
          }
          label={`Continent: ${continent.label}`}
          resources={resources}
        />
      }
    >
      <span>Cities:</span>

      <Box display="flex" flexDirection="column">
        {continent.cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </Box>

      {continent.plots
        .filter((p) => !p.city && p.explored)
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

      {continent.plots.filter((p) => !p.city && !p.explored).length > 0 && (
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
    <Resources hide resources={city.resources} />
  </Box>
)