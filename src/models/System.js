import { Model, many, attr } from 'redux-orm'
export class System extends Model {}
System.modelName = 'System'
System.fields = {
  id: attr(),
  explored: attr(),
  planets: many('Planet', 'system'),
}
