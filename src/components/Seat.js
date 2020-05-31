import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { DragList } from './DragList'
import { finishTask } from '../actions'

const INTERVAL = 100

const Seat = ({ seat }) => {
  const timeoutRef = useRef()
  const [progress, setProgress] = useState(0)
  const dispatch = useDispatch()
  const task = seat.task

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= task.duration * INTERVAL) {
          return 0
        }
        return seat.person ? p + INTERVAL : p
      })
    }, INTERVAL)
    return () => clearInterval(id)
  }, [dispatch, setProgress, seat.person, task.duration])

  useEffect(() => {
    if (progress >= task.duration * INTERVAL) {
      timeoutRef.current = setTimeout(
        () =>
          dispatch(finishTask({ resourceId: seat.task.effect.id, value: 1 })),
        INTERVAL,
      )
    }
  }, [task.duration, seat.task.effect.id, dispatch, progress, setProgress])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const progressPercent = 1 - progress / (task.duration * INTERVAL)
  return (
    <Box display="flex" flexDirection="column" flex={1} maxWidth={90}>
      <Box
        style={{
          flex: 1,
          marginRight: 8,
          position: 'relative',
          backgroundColor: 'lightgray',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box position="relative" zIndex={2}>
          <Box position="relative" style={{ borderBottom: '1px solid #999' }}>
            <Typography
              style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
            >
              {task.id}
            </Typography>

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
          </Box>
          <Box display="flex" justifyContent="center">
            <Box minHeight={56} position="relative" m={1}>
              <Box
                position="absolute"
                bgcolor="gray"
                top={0}
                left={0}
                right={0}
                bottom={0}
                style={{
                  pointerEvents: 'none',
                  opacity: 0.3,
                  zIndex: 1,
                }}
              />
              <DragList
                droppableId={`seat-${seat.id}`}
                isDropDisabled={!!seat.person}
                items={seat.person ? [seat.person] : []}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export { Seat }
