import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { DragList } from './DragList'
import { createBuilding } from '../store'
import { Purchase } from '../../shared/components/Purchase'
// TOOD: need to add tile productivity based on features
// need to add district based effects
export const Tiles = ({ continentId, cityId, tiles }) => {
  return (
    <Box>
      {tiles.map((tile, index) => (
        <Tile key={tile.id || `index-${index}`} cityId={cityId} tile={tile} />
      ))}
    </Box>
  )
}

const Tile = ({ tile, cityId }) => {
  const { district, person } = tile
  return (
    <Box display="flex" flex={1} mt={1}>
      <TileSeat district={district} person={person} id={tile.id} />

      <TileDetails cityId={cityId} district={district} tile={tile} />
    </Box>
  )
}

const TileDetails = ({ cityId, district, tile }) => {
  return (
    <Box>
      {district && district.districtType && (
        <Typography>{district.districtType.label}</Typography>
      )}
      {tile.feature && <Typography>Feature: {tile.feature}</Typography>}
      {tile.resource && <Typography>Resource: {tile.resource}</Typography>}
      {Object.entries(tile.resourceChange).map(([resourceId, value]) => (
        <Typography>
          {resourceId}: {value}
        </Typography>
      ))}
      {(district.buildings || []).map((b) => (
        <>
          <Typography>{b.name}</Typography>
          {Object.entries(b.effects).map(([key, value]) => (
            <Typography>
              {key} {value}
            </Typography>
          ))}
        </>
      ))}
      {(
        (district &&
          district.districtType &&
          district.districtType.buildings) ||
        []
      )
        .filter(
          (b) =>
            !(district.buildings || []).map((b) => b.name).includes(b.name),
        )
        .map((building) => (
          <Purchase
            cityId={+cityId}
            id="buyBuilding"
            action={createBuilding({ name: building.name, id: district.id })}
          />
        ))}
    </Box>
  )
}

const TileSeat = ({ id, district, person }) => (
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
            style={{ pointerEvents: 'none', opacity: 0.3, zIndex: 1 }}
          />
          <DragList
            droppableId={`tile-${id}`}
            isDropDisabled={
              !!person || (!!district && district.districtTypeId === 'center')
            }
            items={person ? [person] : []}
          />
        </Box>
      </Box>
    </Box>
  </Box>
)
