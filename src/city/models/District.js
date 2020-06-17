import { Model, attr, fk, oneToOne } from 'redux-orm'

export class District extends Model {}
District.modelName = 'District'
District.fields = {
  id: attr(),
  districtTypeId: fk({
    to: 'DistrictType',
    as: 'districtType',
    relatedName: 'districts',
  }),
  tileId: oneToOne({ to: 'Tile', as: 'tile', relatedName: 'district' }),
}
