import React from 'react'
import { List } from './List'

export const People = (props) => (
  <List
    droppableId="people"
    items={props.people
      .filter((p) => !p.seat)
      .sort((a, b) => a.index - b.index)}
  />
)
