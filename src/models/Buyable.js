import { Model, attr } from 'redux-orm'
export class Buyable extends Model {}
Buyable.modelName = 'Buyable'
Buyable.fields = {
  id: attr(),
  label: attr(),
  cost: attr(),
}
