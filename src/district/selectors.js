import { createSelector } from 'redux-orm'
import orm from '../orm'

export const getSeatTask = createSelector(orm.Seat.task)
export const getSeatPerson = createSelector(orm.Seat.person)
export const getTask = createSelector(orm.Task)
export const getPerson = createSelector(orm.Person)
export const getDistrict = createSelector(orm.District)
export const getDistrictTypes = createSelector(orm.DistrictType)
export const getDistrictSeats = createSelector(orm.District.seats)
export const getDistrictType = createSelector(orm.District.districtType)
