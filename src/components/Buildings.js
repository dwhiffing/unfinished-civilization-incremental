import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Seat } from './Seat'
import { Purchase } from './Purchase'
import { createSeat } from '../actions'
import groupBy from 'lodash/groupBy'

export const Buildings = ({ continentId, cityId, buildings }) =>
  buildings.map((building) => (
    <Box mb={3} key={`building-${building.id}`}>
      <Typography>{building.label}</Typography>

      <Box>
        <Box>
          {Object.entries(
            groupBy(
              building.seats.filter((s) => !!s.task),
              (seat) => seat.task.id,
            ),
          ).map(([key, value], index) => {
            return (
              <Box key={key} display="flex">
                {value.map((seat) => (
                  <Seat key={`task${seat.id}`} index={index} seat={seat} />
                ))}
                <Purchase
                  continentId={+continentId}
                  id="buySeat"
                  cityId={+cityId}
                  action={createSeat({ buildingId: building.id, taskId: key })}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  ))
