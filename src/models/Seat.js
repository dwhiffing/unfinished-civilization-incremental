import { Model, fk } from 'redux-orm'
export class Seat extends Model {}
Seat.modelName = 'Seat'
Seat.fields = {
  buildingId: fk({ to: 'Building', as: 'building' }),
  taskId: fk({ to: 'Task', as: 'task' }),
  personId: fk({ to: 'Person', as: 'person' }),
}
