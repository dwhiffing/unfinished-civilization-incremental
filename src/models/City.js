import { Model, many, attr } from 'redux-orm'
export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  districts: many('District', 'city'),
  housing: attr(),
  resources: many('ResourceStockpile', 'city'),
  people: many('Person', 'city'),
}
