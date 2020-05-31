import React, { useEffect } from 'react'
import { Typography, Box } from '@material-ui/core'
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
        <Box key={`building-${building.id}`}>
          <Typography>{building.id}</Typography>

          <Box display="flex" key={building.id}>
            {building.seats.map((seat, index) => {
              return (
                <Seat
                  key={`task${index}-${seat.task.id}`}
                  index={index}
                  seat={seat}
                />
              )
            })}
          </Box>
        </Box>
      ))}
    </>
  )
}
