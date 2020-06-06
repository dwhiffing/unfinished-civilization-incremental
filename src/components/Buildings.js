import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Seat } from './Seat'
import { Purchase } from './Purchase'
import { createSeat } from '../actions'

export const Buildings = ({ continentId, cityId, buildings }) => {
  return (
    <>
      {buildings.map((building) => (
        <Box mb={3} key={`building-${building.id}`}>
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
            <Purchase
              continentId={continentId}
              id="buySeat"
              cityId={cityId}
              action={createSeat(building)}
            />
          </Box>
        </Box>
      ))}
    </>
  )
}
