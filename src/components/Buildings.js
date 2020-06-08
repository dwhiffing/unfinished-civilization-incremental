import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Seat } from './Seat'
import { Purchase } from './Purchase'
import { createSeat, createBuilding } from '../actions'
import groupBy from 'lodash/groupBy'
import { useSelector } from 'react-redux'
import { getBuildingTypes } from '../selectors'

export const Buildings = ({ continentId, cityId, buildings }) => {
  const buildingTypes = useSelector(getBuildingTypes).filter(
    (b) => !buildings.map((b) => b.buildingTypeId).includes(b.id),
  )
  return (
    <Box>
      {buildings.map((building) => (
        <BuildingItem
          key={`building-${building.id}`}
          building={building}
          continentId={continentId}
          cityId={cityId}
        />
      ))}
      {buildingTypes.map((buildingType) => (
        <Purchase
          key={buildingType.id}
          id="createBuilding"
          label={`buy ${buildingType.label}`}
          cityId={+cityId}
          action={createBuilding({ cityId, buildingTypeId: buildingType.id })}
        />
      ))}
    </Box>
  )
}

const BuildingItem = (props) => {
  const taskGroups = groupBy(
    props.building.seats.filter((s) => !!s.task),
    (seat) => seat.task.id,
  )
  return (
    <Box mb={3}>
      <Typography>{props.building.label}</Typography>

      {Object.entries(taskGroups).map(([taskId, seats], index) => (
        <BuildingTaskGroupItem
          key={taskId}
          taskId={taskId}
          seats={seats}
          index={index}
          id={props.building.id}
          continentId={props.continentId}
          cityId={props.cityId}
        />
      ))}
    </Box>
  )
}

const BuildingTaskGroupItem = (props) => (
  <Box display="flex">
    {props.seats.map((seat) => (
      <Seat key={`task${seat.id}`} index={props.index} seat={seat} />
    ))}

    <Purchase
      continentId={+props.continentId}
      id="buySeat"
      cityId={+props.cityId}
      action={createSeat({
        buildingId: props.id,
        taskId: props.taskId,
      })}
    />
  </Box>
)
