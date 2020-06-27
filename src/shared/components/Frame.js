import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { Resources, ResourceText } from './Resources'
import { getStockpiles } from '../../city/selectors'
import { getTechnologies, getCivics, getBeliefs } from '../../shared/selectors'
import ReactTooltip from 'react-tooltip'
import { Modal } from '../components/Modal'
import { Purchase } from './Purchase'
import { unlock } from '../store'

export const Frame = ({ children, sidebar }) => {
  const [content, setContent] = useState()
  const globalStockpiles = useSelector((state) => getStockpiles(state)).filter(
    (s) => s.type === 'global',
  )
  const technologies = useSelector((state) => getTechnologies(state))
  const civics = useSelector((state) => getCivics(state))
  const beliefs = useSelector((state) => getBeliefs(state))
  const purchases = {
    science: technologies.map((s) => (
      <Purchase
        key={s.id}
        id={`buyTech-${s.id}`}
        action={unlock(s.unlocks[0])}
      />
    )),
    culture: civics.map((s) => (
      <Purchase
        key={s.id}
        id={`buyCivic-${s.id}`}
        action={unlock(s.unlocks[0])}
      />
    )),
    faith: beliefs.map((s) => (
      <Purchase
        key={s.id}
        id={`buyBelief-${s.id}`}
        action={unlock(s.unlocks[0])}
      />
    )),
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        {globalStockpiles.map((stockpile) => (
          <ResourceText
            onClick={() => {
              setContent(purchases[stockpile.resourceId])
            }}
            key={stockpile.id}
            resource={stockpile}
          />
        ))}
      </Box>

      <Box display="flex">
        <Box
          display="flex"
          flexDirection="column"
          flex={3}
          minWidth={150}
          p={1}
        >
          {sidebar}
        </Box>
        <Box flex={7} p={1}>
          {children}
        </Box>
      </Box>
      <Modal onClose={() => setContent(null)}>{content}</Modal>
      <ReactTooltip place="right" multiline />
    </Box>
  )
}

export const Sidebar = ({
  label,
  resources,
  resourceChange,
  resourceTooltips,
  linkText,
  uri,
  children,
}) => (
  <>
    {uri ? <a href={uri}>{linkText}</a> : <br />}
    <br />
    <span>{label}</span>
    {children}
    <Resources
      resourceTooltips={resourceTooltips}
      resourceChange={resourceChange}
      resources={resources}
    />
  </>
)
