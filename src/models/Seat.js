import { Model, fk } from 'redux-orm'
export class Seat extends Model {}
Seat.modelName = 'Seat'
Seat.fields = {
  districtId: fk({ to: 'District', as: 'district' }),
  taskId: fk({ to: 'Task', as: 'task' }),
  personId: fk({ to: 'Person', as: 'person' }),
}
