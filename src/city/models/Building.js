import { Model, attr, fk } from 'redux-orm'

export class Building extends Model {}
Building.modelName = 'Building'
Building.fields = {
  id: attr(),
  name: attr(),
  cost: attr(),
  effects: attr(),
  districtTypeId: fk({
    to: 'DistrictType',
    as: 'districtType',
    relatedName: 'buildings',
  }),
}
