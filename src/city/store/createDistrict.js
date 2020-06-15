import { createAction } from '@reduxjs/toolkit'

export const createDistrict = createAction('CREATE_BUILDING')
export const createDistrictReducer = (sess, payload) => {
  const { cityId, tileId, districtTypeId, ...district } = payload
  sess.District.create({
    districtTypeId,
    cityId,
    tileId,
    ...district,
  })
  return sess.state
}
