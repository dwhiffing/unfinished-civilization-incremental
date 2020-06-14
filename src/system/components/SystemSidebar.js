import React from 'react'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { Sidebar } from '../../shared/components/Frame'
import { useParams } from 'react-router'
import { getSystemFull } from '../selectors'

export const SystemSidebar = () => {
  const { id = '0' } = useParams()
  const unlocks = useSelector(getUnlocks)
  const system = useSelector((state) => getSystemFull(state, id))

  return (
    <Sidebar
      uri={unlocks.includes('galaxy') && `#/`}
      linkText={unlocks.includes('galaxy') && `Back to Galaxy`}
      label={`System: ${system.label}`}
      resources={system.resources}
    />
  )
}
