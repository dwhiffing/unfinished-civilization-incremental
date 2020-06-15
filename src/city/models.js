import { Model, attr, fk } from 'redux-orm'

export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  housing: attr(),
}

export class ResourceStockpile extends Model {}
ResourceStockpile.modelName = 'ResourceStockpile'
ResourceStockpile.fields = {
  resourceId: fk({ to: 'Resource', as: 'resource', relatedName: 'stockpiles' }),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'stockpiles' }),
  id: attr(),
  amount: attr(),
  color: attr(),
  limit: attr(),
}

export class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'people' }),
}
