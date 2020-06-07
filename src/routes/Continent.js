import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { getContinents, getContinentResourceTotals } from '../selectors'
import { Purchase } from '../components/Purchase'
import { createCity, explore } from '../actions'
import { useParams } from 'react-router'
import { ResourceText } from '../components/Resources'
import { Totals } from '../components/Totals'

export const Continent = () => {
  const { id } = useParams()
  const continent = useSelector(getContinents).find((c) => `${c.id}` === id)
  const totals = useSelector(getContinentResourceTotals(+id))

  if (!continent) {
    return null
  }

  return (
    <Box>
      <a href={`#/planet/${continent.planet.id}`}>
        Back to {continent.planet.label}
      </a>

      <Box my={2}>
        <Totals label={`Continent: ${continent.label}`} totals={totals} />
      </Box>

      <span>Cities:</span>

      <Box display="flex" flexDirection="column">
        {continent.cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </Box>

      {continent.plots
        .filter((p) => !p.city && p.explored)
        .map((plot) => {
          return (
            <Purchase
              key={`${plot.id}-explore`}
              continentId={+id}
              id="buyCity"
              action={createCity({ plotId: plot.id })}
            />
          )
        })}

      {continent.plots.filter((p) => !p.city && !p.explored).length > 0 && (
        <Purchase
          continentId={+id}
          id="exploreContinent"
          action={explore({ continentId: continent.id })}
        />
      )}
    </Box>
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
    <Box display="flex">
      {city.resources.map((r, i) => (
        <ResourceText key={i} resource={r} />
      ))}
    </Box>
  </Box>
)
