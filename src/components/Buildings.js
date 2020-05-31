import React from 'react'
import { Typography, Box, Button } from '@material-ui/core'
import { Seat } from './Seat'
import { useDispatch } from 'react-redux'

export const Buildings = ({ buildings }) => {
  const dispatch = useDispatch()

  return (
    <>
      {buildings.map((building) => (
        <Box key={`building-${building.id}`}>
          <Typography>{building.label}</Typography>

          <Box display="flex">
            {building.seats.map((seat, index) => {
              return (
                <Seat
                  key={`task${index}-${seat.task.id}`}
                  index={index}
                  seat={seat}
                />
              )
            })}
            <Button
              onClick={() =>
                dispatch({
                  type: 'CREATE_SEAT',
                  payload: {
                    buildingId: building.id,
                    task: building.seats[0].task,
                  },
                })
              }
            >
              Create
            </Button>
          </Box>
        </Box>
      ))}
    </>
  )
}
