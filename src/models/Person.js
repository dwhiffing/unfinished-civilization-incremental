import { Model, attr } from 'redux-orm'
export class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  seat: attr(),
}
