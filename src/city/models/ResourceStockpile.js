import { Model, attr, fk } from 'redux-orm'

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
