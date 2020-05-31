import React from 'react'
import { DragList } from './DragList'
import { getPeople } from '../selectors'
import { useSelector } from 'react-redux'

export const People = () => {
  const people = useSelector((state) => getPeople(state))

  return (
    <DragList
      droppableId="people"
      items={people.filter((p) => !p.seat).sort((a, b) => a.index - b.index)}
    />
  )
}
