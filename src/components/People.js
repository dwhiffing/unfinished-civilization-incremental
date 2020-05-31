import React from 'react'
import { DragList } from './DragList'
import { Box } from '@material-ui/core'

export const People = (props) => (
  <DragList
    droppableId="people"
    items={props.people
      .filter((p) => !p.seat)
      .sort((a, b) => a.index - b.index)}
  />
)
