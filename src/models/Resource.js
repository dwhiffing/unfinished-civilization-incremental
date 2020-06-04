import { Model, attr } from 'redux-orm'
export class Resource extends Model {}
Resource.modelName = 'Resource'
Resource.fields = {
  id: attr(),
}
