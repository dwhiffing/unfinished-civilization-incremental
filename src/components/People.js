import React from 'react'
import { DragList } from './DragList'
import { Purchase } from './Purchase'
import { createPerson } from '../actions'

export const People = ({ cityId, people }) => {
  return (
    <>
      <DragList
        droppableId="people"
        items={people.filter((p) => !p.seat).sort((a, b) => a.index - b.index)}
      />
      <Purchase cityId={cityId} id="buyPerson" action={createPerson(cityId)} />
    </>
  )
}
