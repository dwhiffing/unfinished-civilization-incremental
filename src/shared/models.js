import { Model, attr } from 'redux-orm'

export class Technology extends Model {}
Technology.modelName = 'Technology'
Technology.fields = {
  id: attr(),
  label: attr(),
  cost: attr(),
  unlocks: attr(),
}

export class Civic extends Model {}
Civic.modelName = 'Civic'
Civic.fields = {
  id: attr(),
  label: attr(),
  cost: attr(),
  unlocks: attr(),
}

export class Belief extends Model {}
Belief.modelName = 'Belief'
Belief.fields = {
  id: attr(),
  label: attr(),
  cost: attr(),
  unlocks: attr(),
}

export class Buyable extends Model {}
Buyable.modelName = 'Buyable'
Buyable.fields = {
  id: attr(),
  label: attr(),
  cost: attr(),
  oneTime: attr(),
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
