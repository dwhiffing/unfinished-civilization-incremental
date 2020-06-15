import React from 'react'
import { useSelector } from 'react-redux'
import { Districts } from '../../district/components/Districts'
import { getCityFull } from '../selectors'
import { useParams } from 'react-router'

export const CityRoute = () => {
  const { id = '0' } = useParams()
  const city = useSelector((state) => getCityFull(state, +id))

  if (!city || !city.continent) {
    return null
  }

  return (
    <>
      <Districts
        continentId={city.continent.id}
        cityId={city.id}
        districts={city.districts}
      />
    </>
  )
}
