import { Model, attr, fk, oneToOne } from 'redux-orm'

export class City extends Model {}
City.modelName = 'City'
City.fields = {
  id: attr(),
  housing: attr(),
}

export class ResourceStockpile extends Model {}
ResourceStockpile.modelName = 'ResourceStockpile'
ResourceStockpile.fields = {
  resourceId: fk({ to: 'Resource', as: 'resource', relatedName: 'stockpiles' }),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'stockpiles' }),
  id: attr(),
  amount: attr(),
  color: attr(),
  limit: attr(),
}

export class Person extends Model {}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'people' }),
}

export class Tile extends Model {}
Tile.modelName = 'Tile'
Tile.fields = {
  cityId: fk({ to: 'City', as: 'city', relatedName: 'tiles' }),
  personId: oneToOne({ to: 'Person', as: 'person', relatedName: 'tile' }),
}

export class DistrictType extends Model {}
DistrictType.modelName = 'DistrictType'
DistrictType.fields = {
  id: attr(),
  label: attr(),
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
  tileId: oneToOne({ to: 'Tile', as: 'tile', relatedName: 'district' }),
}
