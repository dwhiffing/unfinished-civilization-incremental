import { Model, many, attr, fk } from 'redux-orm'
export class District extends Model {}
District.modelName = 'District'
District.fields = {
  id: attr(),
  districtTypeId: fk({ to: 'DistrictType', as: 'districtType' }),
  seats: many('Seat', 'districts'),
}
