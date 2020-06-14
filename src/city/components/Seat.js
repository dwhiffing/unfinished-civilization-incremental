import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { DragList } from './DragList'
import { INTERVAL } from '../../shared/data'

const Seat = ({ seat }) => {
  const progressPercent = 1 - seat.progress / seat.task.duration
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
        <Box position="relative">
          <Box position="relative" style={{ borderBottom: '1px solid #999' }}>
            <Typography
              style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
            >
              {seat.task.id}
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