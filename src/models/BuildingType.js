import { Model, attr } from 'redux-orm'
export class BuildingType extends Model {}
BuildingType.modelName = 'BuildingType'
BuildingType.fields = {
  id: attr(),
  // what task seats does this building have
  tasks: attr(),
}
