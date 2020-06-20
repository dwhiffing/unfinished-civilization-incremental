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
      <TileBuildings cityId={cityId} district={district} tile={tile} />
    </Box>
  )
}

const TileDetails = ({ cityId, district, tile }) => {
  return (
    <Box mr={2}>
      {district && district.districtType && (
        <Typography>{district.districtType.label}</Typography>
      )}

      {tile.feature && <Typography>Feature: {tile.feature}</Typography>}

      {tile.resource && <Typography>Resource: {tile.resource}</Typography>}

      {Object.entries(tile.resourceChange).map(([resourceId, value]) => (
        <Typography key={`resourceChange-${resourceId}`}>
          {resourceId}: +{value}/sec
        </Typography>
      ))}
    </Box>
  )
}

const TileBuildings = ({ cityId, district, tile }) => {
  const buildings = Object.values(district.buildings || {})
  const districtType = district && district.districtType
  const districtTypeBuildings =
    (districtType && district.districtType.buildings) || []
  const purchasableBuildingIds = districtTypeBuildings.filter(
    (buildingId) => !buildings.map((b) => b.id).includes(buildingId),
  )

  return (
    <Box>
      {buildings.map((building) => (
        <BuildingItem key={`building-${building.id}`} building={building} />
      ))}

      {purchasableBuildingIds.map((buildingId) => (
        <Purchase
          key={`purchase-${buildingId}`}
          cityId={+cityId}
          id="buyBuilding"
          action={createBuilding({
            id: buildingId,
            districtId: district.id,
          })}
        />
      ))}
    </Box>
  )
}

const BuildingItem = ({ building }) => (
  <Box>
    <Typography>{building.id}</Typography>
    cost:<Typography>{JSON.stringify(building.cost)}</Typography>
    effects:<Typography>{JSON.stringify(building.effects)}</Typography>
  </Box>
)

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
