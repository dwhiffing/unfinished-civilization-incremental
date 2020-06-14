import { Model, attr } from 'redux-orm'
export class System extends Model {}
System.modelName = 'System'
System.fields = {
  id: attr(),
  explored: attr(),
}
