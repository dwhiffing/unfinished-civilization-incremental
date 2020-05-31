import { Model, ORM, many, attr, fk } from 'redux-orm'

class Seat extends Model {}
Seat.modelName = 'Seat'
Seat.fields = {
  buildingId: fk({ to: 'Building', as: 'building' }),
  taskId: fk({ to: 'Task', as: 'task' }),
  personId: fk({ to: 'Person', as: 'person' }),
}

class Task extends Model {}
Task.modelName = 'Task'
Task.fields = {
  id: attr(),
}

class Building extends Model {}
Building.modelName = 'Building'
Building.fields = {
  id: attr(),
  seats: many('Seat', 'buildings'),
}

class Resource extends Model {}
Resource.modelName = 'Resource'
Resource.fields = {
  id: attr(),
  amount: attr(),
}

class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  seat: attr(),
}

const orm = new ORM({ stateSelector: (state) => state.root })
orm.register(Task, Building, Resource, Person, Seat)

export default orm
