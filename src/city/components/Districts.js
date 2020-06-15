import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Purchase } from '../../shared/components/Purchase'
import { createSeat, createDistrict } from './store'
import groupBy from 'lodash/groupBy'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../../shared/selectors'
import {
  getDistrictType,
  getDistrictTypes,
  getDistrictSeats,
} from './selectors'
import { People } from './People'
import { getCityPeople } from '../selectors'

export const Districts = ({ continentId, cityId, districts }) => {
  const unlocks = useSelector(getUnlocks)
  const districtTypes = useSelector(getDistrictTypes).filter(
    (b) => !districts.map((b) => b.districtTypeId).includes(b.id),
  )
  return (
    <Box>
      {districts
        .filter((d) => unlocks.includes(d.districtTypeId))
        .map((district) => {
          const Component =
            district.districtTypeId === 'center'
              ? CityCenterDistrict
              : DistrictItem
          return (
            <Component
              key={`district-${district.id}`}
              districtId={district.id}
              continentId={continentId}
              cityId={cityId}
            />
          )
        })}
      {districtTypes
        .filter((b) => unlocks.includes(b.id))
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

const DistrictItem = ({ continentId, cityId, districtId }) => {
  const districtType = useSelector((state) =>
    getDistrictType(state, districtId),
  )
  const seats = useSelector((state) => getDistrictSeats(state, districtId))

  const taskGroups = groupBy(seats, (seat) => seat.taskId)
  return (
    <Box mb={3}>
      <Typography>{districtType.label}</Typography>

      {Object.entries(taskGroups).map(([taskId, seats], index) => (
        <DistrictTaskGroupItem
          key={taskId}
          taskId={taskId}
          seats={seats}
          index={index}
          id={districtId}
          continentId={continentId}
          cityId={cityId}
        />
      ))}
    </Box>
  )
}

const DistrictTaskGroupItem = (props) => (
  <Box display="flex">
    {/* {props.seats.map((seat) => (
      <Seat key={`task${seat.id}`} index={props.index} seat={seat} />
    ))} */}

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

const CityCenterDistrict = ({ continentId, cityId, districtId }) => {
  const districtType = useSelector((state) =>
    getDistrictType(state, districtId),
  )
  const seats = useSelector((state) => getDistrictSeats(state, districtId))
  const people = useSelector((state) => getCityPeople(state, cityId))
  const taskGroups = groupBy(seats, (seat) => seat.taskId)

  return (
    <Box mb={3}>
      <Typography>{districtType.label}</Typography>

      <People people={people} />

      {Object.entries(taskGroups).map(([taskId, seats], index) => (
        <DistrictTaskGroupItem
          key={taskId}
          taskId={taskId}
          seats={seats}
          index={index}
          id={districtId}
          continentId={continentId}
          cityId={cityId}
        />
      ))}
    </Box>
  )
}
