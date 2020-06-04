import { Model, many, attr } from 'redux-orm'
export class Nation extends Model {}
Nation.modelName = 'Nation'
Nation.fields = {
  id: attr(),
  cities: many('City', 'nation'),
}
