import React from 'react'
import { DragList } from './DragList'

export const People = (props) => (
  <DragList
    droppableId="people"
    items={props.people
      .filter((p) => !p.seat)
      .sort((a, b) => a.index - b.index)}
  />
)
