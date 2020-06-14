import React from 'react'
import { useSelector } from 'react-redux'
import { getResourceTotals } from '../selectors'
import { Sidebar } from './Frame'
export const GalaxySidebar = () => {
  const resources = useSelector(getResourceTotals)
  return <Sidebar label="Galaxy" resources={resources} />
}
