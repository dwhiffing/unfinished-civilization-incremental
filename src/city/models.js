import { Model, attr, fk, oneToOne } from 'redux-orm'

export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  housing: attr(),
  // plotId: oneToOne({ to: 'Plot', as: 'plot', relatedName: 'city' }),
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
  districtTypeId: fk({
    to: 'DistrictType',
    as: 'districtType',
    relatedName: 'districts',
  }),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'districts' }),
}

export class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'people' }),
}

export class ResourceStockpile extends Model {}
ResourceStockpile.modelName = 'ResourceStockpile'
ResourceStockpile.fields = {
  resourceId: fk({ to: 'Resource', as: 'resource', relatedName: 'stockpiles' }),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'stockpiles' }),
  id: attr(),
  amount: attr(),
  limit: attr(),
}

export class Seat extends Model {}
Seat.modelName = 'Seat'
Seat.fields = {
  districtId: fk({ to: 'District', as: 'district', relatedName: 'seats' }),
  taskId: fk({ to: 'Task', as: 'task', relatedName: 'seats' }),
  personId: oneToOne({ to: 'Person', as: 'person', relatedName: 'seat' }),
}

export class Task extends Model {}
Task.modelName = 'Task'
Task.fields = {
  id: attr(),
  duration: attr(),
  effects: attr(),
}
