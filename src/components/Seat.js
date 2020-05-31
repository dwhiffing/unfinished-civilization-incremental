import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { DragList } from './DragList'
import { finishTask } from '../utils/actions'

const INTERVAL = 100

const Seat = ({ seat }) => {
  const timeoutRef = useRef()
  const [progress, setProgress] = useState(0)
  const dispatch = useDispatch()
  const task = seat.task

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) =>
        // TODO: refactor
        p >= task.duration * INTERVAL ? 0 : seat.person ? p + INTERVAL : p,
      )
    }, INTERVAL)
    return () => {
      clearInterval(id)
    }
  }, [dispatch, setProgress, seat.person, task.duration])

  useEffect(() => {
    if (progress >= task.duration * INTERVAL) {
      timeoutRef.current = setTimeout(
        () => dispatch(finishTask({ resourceId: 0, value: 1 })),
        INTERVAL,
      )
    }
  }, [task.duration, dispatch, progress, setProgress])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (progress >= task.duration * INTERVAL) {
      let id = setTimeout(() => {
        dispatch(finishTask({ resourceId: 0, value: 1 }))
      }, INTERVAL)
      return () => {
        clearTimeout(id)
      }
    }
  }, [task.duration, dispatch, progress, setProgress])

  const progressPercent = 1 - progress / (task.duration * INTERVAL)
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
            style={{
              transition: `right ${INTERVAL}ms`,
              transitionTimingFunction: 'linear',
              zIndex: 1,
            }}
            right={`${progressPercent * 100}%`}
          />
        )}
        <Box position="relative" zIndex={2}>
          <DragList
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

export { Seat }
