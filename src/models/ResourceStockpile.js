import { Model, attr, fk } from 'redux-orm'
export class ResourceStockpile extends Model {}
ResourceStockpile.modelName = 'ResourceStockpile'
ResourceStockpile.fields = {
  id: attr(),
  resourceId: fk({ to: 'Resource', as: 'resource' }),
  amount: attr(),
}
