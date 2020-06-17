import { Model, attr, fk, oneToOne } from 'redux-orm'

export class DistrictType extends Model {}
DistrictType.modelName = 'DistrictType'
DistrictType.fields = {
  id: attr(),
  label: attr(),
}

