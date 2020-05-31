import React, { useEffect } from 'react'
import { Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { Seat } from './Seat'
import { init } from '../utils/actions'

export const Buildings = ({ buildings }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(init())
  }, [dispatch])

  return (
    <>
      {buildings.map((building) => (
        <div key={building.label}>
          <Typography>{building.label}</Typography>

          {building.seats.map((seat, index) => {
            return (
              <Seat
                key={`task${index}-${seat.task.label}`}
                index={index}
                seat={seat}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}
