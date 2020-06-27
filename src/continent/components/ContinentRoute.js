import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@material-ui/core'
import { getContinentFull } from '../selectors'
import { Purchase } from '../../shared/components/Purchase'
import { explore } from '../../shared/store'
import { createCity } from '../../city/store'
import { useParams } from 'react-router'

export const ContinentRoute = () => {
  const { id = '0' } = useParams()
  const continent = useSelector((state) => getContinentFull(state, +id))

  if (!continent || !continent.planet) {
    return null
  }

  return (
    <>
      <span>Cities:</span>

      <Box display="flex" flexDirection="column">
        {continent.cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </Box>

      {continent.plots
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

      {continent.plots.filter((p) => !p.city && !p.explored).length > 0 && (
        <Purchase
          continentId={+id}
          id="exploreContinent"
          action={explore({ continentId: continent.id })}
        />
      )}
    </>
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
  </Box>
)
