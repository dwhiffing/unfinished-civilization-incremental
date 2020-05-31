import React from 'react'
import { DragList } from './DragList'
import { Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'

export const People = ({ cityId, people }) => {
  const dispatch = useDispatch()
  return (
    <>
      <DragList
        droppableId="people"
        items={people.filter((p) => !p.seat).sort((a, b) => a.index - b.index)}
      />
      <Button
        onClick={() =>
          dispatch({
            type: 'CREATE_PERSON',
            payload: { cityId: cityId },
          })
        }
      >
        Create
      </Button>
    </>
  )
}
