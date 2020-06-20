import { createAction } from '@reduxjs/toolkit'

export const createBuilding = createAction('CREATE_BUILDING')
export const createBuildingReducer = (sess, payload) => {
  const district = sess.District.withId(payload.districtId)
  const building = sess.Building.withId(payload.id)
  district.update({
    buildings: {
      ...(district.buildings || {}),
      [building.id]: { id: building.id },
    },
  })

  return sess.state
}
