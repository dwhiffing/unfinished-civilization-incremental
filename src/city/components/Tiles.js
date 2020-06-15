import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { DragList } from './DragList'
import { useSelector } from 'react-redux'
import { getTilesDistrict, getTilesPerson } from '../selectors'

export const Tiles = ({ continentId, cityId, tiles }) => {
  return (
    <Box>
      {tiles.map((tile) => {
        return <Tile key={tile.id} tile={tile} />
      })}
    </Box>
  )
}

const Tile = ({ tile }) => {
  const person = useSelector((state) => getTilesPerson(state, tile.id))
  const district = useSelector((state) => getTilesDistrict(state, tile.id))
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
          {district && <Typography>{district.districtTypeId}</Typography>}
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
                droppableId={`tile-${tile.id}`}
                isDropDisabled={!!person}
                items={person ? [person] : []}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
