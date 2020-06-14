import { createSelector } from 'redux-orm'
import { totalResources } from '../shared/selectors'
import orm from '../orm'

export const getCity = createSelector(orm.City)
export const getCityPlot = createSelector(orm.City.plot)
export const getCityDistricts = createSelector(orm.City.districts)
export const getCityResources = createSelector(orm.City.stockpiles)
export const getCityContinent = createSelector(orm.City.plot.continent)

export const getTask = createSelector(orm.Task)
export const getPerson = createSelector(orm.Person)
export const getDistrict = createSelector(orm.District)
export const getPersonSeat = createSelector(orm.Person.seat)
export const getDistrictTypes = createSelector(orm.DistrictType)
export const getDistrictSeats = createSelector(orm.District.seats)
export const getDistrictType = createSelector(orm.District.districtType)

export const getCityResourceTotals = createSelector(
  orm,
  getCityResources,
  (_, stockpiles) => totalResources(stockpiles),
)

export const getCityPeople = createSelector(
  orm,
  orm.City.people,
  (state, people) =>
    people
      ? people
          .filter((s) => !!s)
          .map((p) => {
            const seat = state.Seat.all()
              .toModelArray()
              .find((s) => s.personId === p.id)
            return { ...p, seat: seat ? seat.ref : null }
          })
      : [],
)
