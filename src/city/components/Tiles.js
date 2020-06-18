import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { DragList } from './DragList'
// TOOD: need to add tile productivity based on features
// need to add district based effects
export const Tiles = ({ continentId, cityId, tiles }) => {
  return (
    <Box>
      {tiles.map((tile, index) => {
        return <Tile key={tile.id || `index-${index}`} tile={tile} />
      })}
    </Box>
  )
}

const Tile = ({ tile }) => {
  const { district, person } = tile
  return (
    <Box display="flex" flex={1} mt={1}>
      <Box
        maxWidth={90}
        style={{
          flex: 1,
          marginRight: 8,
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box position="relative">
          <Box display="flex" justifyContent="center">
            <Box
              minHeight={56}
              position="relative"
              m={1}
              style={{
                opacity:
                  !!district && district.districtTypeId === 'center' ? 0.3 : 1,
              }}
            >
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
                droppableId={`tile-${tile.id}`}
                isDropDisabled={
                  !!person ||
                  (!!district && district.districtTypeId === 'center')
                }
                items={person ? [person] : []}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        {district && <Typography>{district.districtTypeId}</Typography>}
        {tile.feature && <Typography>Feature: {tile.feature}</Typography>}
        {tile.resource && <Typography>Resource: {tile.resource}</Typography>}
        {Object.entries(tile.resourceChange).map(([resourceId, value]) => (
          <Typography>
            {resourceId}: {value}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}
