import { Model, attr, fk, oneToOne } from 'redux-orm'

export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  housing: attr(),
}
