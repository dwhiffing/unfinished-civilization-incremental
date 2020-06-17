import { Model, attr, fk, oneToOne } from 'redux-orm'

export class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'people' }),
}
