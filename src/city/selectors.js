import { createSelector } from 'redux-orm'
import { totalResources } from '../shared/selectors'
import orm from '../orm'

export const getCity = createSelector(orm.City)
export const getCityPlot = createSelector(orm.City.plot)
export const getCitySeats = createSelector(
  orm.City.districts.map(orm.District.seats),
)
export const getCityDistricts = createSelector(orm.City.districts)
export const getCityResources = createSelector(orm.City.stockpiles)
export const getCityContinent = createSelector(orm.City.plot.continent)

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

export const getCityFull = createSelector(
  orm,
  getCity,
  getCityPlot,
  getCitySeats,
  getCityDistricts,
  getCityResources,
  getCityContinent,
  getCityPeople,
  (_, city, plot, seats, districts, resources, continent, people) => ({
    ...city,
    plot,
    seats: seats ? seats.flat() : [],
    people,
    continent,
    resources,
    districts,
  }),
)
