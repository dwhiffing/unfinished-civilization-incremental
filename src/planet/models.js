import { Model, attr, fk } from 'redux-orm'
export class Planet extends Model {}
Planet.modelName = 'Planet'
Planet.fields = {
  id: attr(),
  type: attr(),
  systemId: fk({ to: 'System', as: 'system', relatedName: 'planets' }),
}
