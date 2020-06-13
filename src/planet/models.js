import { Model, many, attr } from 'redux-orm'
export class Planet extends Model {}
Planet.modelName = 'Planet'
Planet.fields = {
  id: attr(),
  type: attr(),
  continents: many('Continent', 'planet'),
}
