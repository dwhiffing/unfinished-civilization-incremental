import { Model, ORM, many, attr, fk } from 'redux-orm'

class Task extends Model {}
Task.modelName = 'Task'
Task.fields = {
  id: attr(),
  // how long this task takes
  duration: attr(),
  // what resource change happens when this task is finished {id, value}
  effect: attr(),
}

class Seat extends Model {}
Seat.modelName = 'Seat'
Seat.fields = {
  buildingId: fk({ to: 'Building', as: 'building' }),
  taskId: fk({ to: 'Task', as: 'task' }),
  personId: fk({ to: 'Person', as: 'person' }),
}

class BuildingType extends Model {}
BuildingType.modelName = 'BuildingType'
BuildingType.fields = {
  id: attr(),
  // what task seats does this building have
  tasks: attr(),
}

class Building extends Model {}
Building.modelName = 'Building'
Building.fields = {
  id: attr(),
  buildingTypeId: fk({ to: 'BuildingType', as: 'buildingType' }),
  seats: many('Seat', 'buildings'),
}

class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  buildings: many('Building', 'city'),
  resources: many('ResourceStockpile', 'city'),
  people: many('Person', 'city'),
}

class Resource extends Model {}
Resource.modelName = 'Resource'
Resource.fields = {
  id: attr(),
}

class ResourceStockpile extends Model {}
ResourceStockpile.modelName = 'ResourceStockpile'
ResourceStockpile.fields = {
  id: attr(),
  resourceId: fk({ to: 'Resource', as: 'resource' }),
  amount: attr(),
}

class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  seat: attr(),
}

const orm = new ORM({ stateSelector: (state) => state.root })
orm.register(
  Task,
  Building,
  Resource,
  Person,
  Seat,
  BuildingType,
  ResourceStockpile,
  City,
)

export default orm
