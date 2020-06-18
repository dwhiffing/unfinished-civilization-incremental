import { createAction } from '@reduxjs/toolkit'

export const createBuilding = createAction('CREATE_BUILDING')
export const createBuildingReducer = (sess, payload) => {
  const district = sess.District.withId(payload.id)
  const building = district.districtType.buildings.find(
    (b) => b.name === payload.name,
  )

  district.update({ buildings: [...(district.buildings || []), building] })

  return sess.state
}
