import { Model, attr } from 'redux-orm'
export class DistrictType extends Model {}
DistrictType.modelName = 'DistrictType'
DistrictType.fields = {
  id: attr(),
  label: attr(),
  // what task seats does this district have
  tasks: attr(),
}
