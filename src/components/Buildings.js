import React, { useEffect } from 'react'
import { Typography, Box } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { Seat } from './Seat'
import { init } from '../actions'
import { getBuildings } from '../selectors'

export const Buildings = () => {
  const dispatch = useDispatch()
  const buildings = useSelector((state) => getBuildings(state))

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
