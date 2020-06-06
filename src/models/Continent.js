import { Model, many, attr } from 'redux-orm'
export class Continent extends Model {}
Continent.modelName = 'Continent'
Continent.fields = {
  id: attr(),
  cities: many('City', 'continent'),
}
