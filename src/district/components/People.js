import React from 'react'
import { DragList } from './DragList'

export const People = ({ people }) => (
  <>
    <DragList
      droppableId="people"
      items={people.filter((p) => !p.seat).sort((a, b) => a.index - b.index)}
    />
  </>
)
