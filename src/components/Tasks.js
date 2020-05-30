import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@material-ui/core'
import { INTERVAL } from '../utils/constants'
import { useInterval } from '../utils/useInterval'
import { useDispatch } from 'react-redux'
import { List } from './List'
import defer from 'lodash/defer'

export const Tasks = ({ buildings }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'INIT' })
  }, [dispatch])

  return (
    <>
      {buildings.map((building) => (
        <div key={building.label}>
          <Typography>{building.label}</Typography>

          {building.seats.map((seat, index) => {
            return (
              <SeatItem
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

function SeatItem({ index, seat }) {
  const [progress, setProgress] = useState(0)
  const dispatch = useDispatch()

  // TODO: need to only progress task if seat is active
  useInterval(() => {
    setProgress((p) => {
      if (p >= task.duration * 1000) {
        defer(() =>
          dispatch({
            type: 'FINISH_TASK',
            payload: { resourceId: 0, value: 1 },
          }),
        )
        return 0
      }
      return seat.person ? p + INTERVAL : p
    })
  }, INTERVAL)

  const task = seat.task
  const progressPercent = 1 - progress / (task.duration * 1000)
  return (
    <Box display="flex" flexDirection="column" flex={1} maxWidth={300}>
      <Box
        style={{
          flex: 1,
          margin: 8,
          position: 'relative',
          backgroundColor: 'lightgray',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {typeof progressPercent === 'number' && (
          <Box
            position="absolute"
            bgcolor="green"
            top={0}
            left={0}
            bottom={0}
            style={{ transition: `right ${INTERVAL - 1}ms`, zIndex: 1 }}
            right={`${progressPercent * 100}%`}
          />
        )}
        <Box position="relative" zIndex={2}>
          <List
            droppableId={`seat-${seat.id}`}
            isDropDisabled={!!seat.person}
            items={seat.person ? [seat.person] : []}
          />
          <Typography>{task.label}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
