import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Seat } from './Seat'
import { Purchase } from '../../shared/components/Purchase'
import { createSeat, createDistrict } from '../store'
import groupBy from 'lodash/groupBy'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import { getDistrictTypes } from '../selectors'

export const Districts = ({ continentId, cityId, districts }) => {
  const unlocks = useSelector(getUnlocks)
  const districtTypes = useSelector(getDistrictTypes).filter(
    (b) => !districts.map((b) => b.districtTypeId).includes(b.id),
  )
  return (
    <Box>
      {districts
        .filter((b) => unlocks.includes(b.districtTypeId))
        .map((district) => (
          <DistrictItem
            key={`district-${district.id}`}
            district={district}
            continentId={continentId}
            cityId={cityId}
          />
        ))}
      {districtTypes
        .filter((b) => unlocks.includes(b.districtTypeId))
        .map((districtType) => (
          <Purchase
            key={districtType.id}
            id="createDistrict"
            label={`buy ${districtType.label}`}
            cityId={+cityId}
            action={createDistrict({ cityId, districtTypeId: districtType.id })}
          />
        ))}
    </Box>
  )
}

const DistrictItem = (props) => {
  const taskGroups = groupBy(
    props.district.seats.filter((s) => !!s.task),
    (seat) => seat.task.id,
  )
  return (
    <Box mb={3}>
      <Typography>{props.district.label}</Typography>

      {Object.entries(taskGroups).map(([taskId, seats], index) => (
        <DistrictTaskGroupItem
          key={taskId}
          taskId={taskId}
          seats={seats}
          index={index}
          id={props.district.id}
          continentId={props.continentId}
          cityId={props.cityId}
        />
      ))}
    </Box>
  )
}

const DistrictTaskGroupItem = (props) => (
  <Box display="flex">
    {props.seats.map((seat) => (
      <Seat key={`task${seat.id}`} index={props.index} seat={seat} />
    ))}

    <Purchase
      continentId={+props.continentId}
      id="buySeat"
      cityId={+props.cityId}
      action={createSeat({
        districtId: props.id,
        taskId: props.taskId,
      })}
    />
  </Box>
)
