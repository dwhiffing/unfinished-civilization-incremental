import React from 'react'
import { useSelector } from 'react-redux'
import { Tiles } from './Tiles'
import { getCityFull } from '../selectors'
import { useParams } from 'react-router'
import { People } from './People'

export const CityRoute = () => {
  const { id = '0' } = useParams()
  const city = useSelector((state) => getCityFull(state, +id))

  if (!city || !city.continent) {
    return null
  }

  return (
    <>
      <People people={city.people} />
      <Tiles
        continentId={city.continent.id}
        cityId={city.id}
        tiles={city.tiles}
      />
    </>
  )
}
