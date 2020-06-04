import { Model, many, attr, fk } from 'redux-orm'
export class Building extends Model {}
Building.modelName = 'Building'
Building.fields = {
  id: attr(),
  buildingTypeId: fk({ to: 'BuildingType', as: 'buildingType' }),
  seats: many('Seat', 'buildings'),
}
