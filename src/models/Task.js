import { Model, attr } from 'redux-orm'
export class Task extends Model {}
Task.modelName = 'Task'
Task.fields = {
  id: attr(),
  // how long this task takes
  duration: attr(),
  // what resource change happens when this task is finished {id, value}
  effect: attr(),
}
