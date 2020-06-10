import { Model, many, attr } from 'redux-orm'
export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  buildings: many('Building', 'city'),
  housing: attr(),
  resources: many('ResourceStockpile', 'city'),
  people: many('Person', 'city'),
}
