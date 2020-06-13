import { Model, many, attr, fk } from 'redux-orm'

export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  districts: many('District', 'city'),
  housing: attr(),
  resources: many('ResourceStockpile', 'city'),
  people: many('Person', 'city'),
}

export class DistrictType extends Model {}
DistrictType.modelName = 'DistrictType'
DistrictType.fields = {
  id: attr(),
  label: attr(),
  tasks: attr(),
}

export class District extends Model {}
District.modelName = 'District'
District.fields = {
  id: attr(),
  districtTypeId: fk({ to: 'DistrictType', as: 'districtType' }),
  seats: many('Seat', 'districts'),
}

export class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  seat: attr(),
}

export class ResourceStockpile extends Model {}
ResourceStockpile.modelName = 'ResourceStockpile'
ResourceStockpile.fields = {
  id: attr(),
  resourceId: fk({ to: 'Resource', as: 'resource' }),
  amount: attr(),
  limit: attr(),
}

export class Seat extends Model {}
Seat.modelName = 'Seat'
Seat.fields = {
  districtId: fk({ to: 'District', as: 'district' }),
  taskId: fk({ to: 'Task', as: 'task' }),
  personId: fk({ to: 'Person', as: 'person' }),
}

export class Task extends Model {}
Task.modelName = 'Task'
Task.fields = {
  id: attr(),
  duration: attr(),
  effects: attr(),
}
