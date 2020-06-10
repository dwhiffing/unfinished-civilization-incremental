import { Model, attr } from 'redux-orm'
export class Unlock extends Model {}
Unlock.modelName = 'Unlock'
Unlock.fields = {
  id: attr(),
}
