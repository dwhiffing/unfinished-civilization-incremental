import React from 'react'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { Sidebar } from '../../shared/components/Frame'
import { useParams } from 'react-router'
import { getPlanetFull } from '../selectors'
export const PlanetSidebar = () => {
  const unlocks = useSelector(getUnlocks)
  const { id = '0' } = useParams()
  const planet = useSelector((state) => getPlanetFull(state, id))
  return (
    <Sidebar
      uri={unlocks.includes('system') && `#/system/${planet.system.id}`}
      linkText={unlocks.includes('system') && `Back to ${planet.system.label}`}
      label={`Planet: ${planet.label}`}
      resources={planet.resources}
    >
      <span>{planet.type.id}</span>
    </Sidebar>
  )
}
