import { Model, attr } from 'redux-orm'

export class Buyable extends Model {}
Buyable.modelName = 'Buyable'
Buyable.fields = {
  id: attr(),
  label: attr(),
  cost: attr(),
}

export class Unlock extends Model {}
Unlock.modelName = 'Unlock'
Unlock.fields = {
  id: attr(),
}

export class Resource extends Model {}
Resource.modelName = 'Resource'
Resource.fields = {
  id: attr(),
}
