import { Model, attr, fk, oneToOne } from 'redux-orm'

export class Tile extends Model {}
Tile.modelName = 'Tile'
Tile.fields = {
  feature: attr(),
  resource: attr(),
  cityId: fk({ to: 'City', as: 'city', relatedName: 'tiles' }),
  personId: oneToOne({ to: 'Person', as: 'person', relatedName: 'tile' }),
}

export const BASE_EFFECTS = {
  hills: { resources: { food: 1, stone: 1 } },
  grassland: { resources: { food: 2 } },
  forest: { resources: { food: 2, wood: 2 } },
}

export const RESOURCE_EFFECTS = {
  cows: { resources: { food: 3 } },
  deer: { resources: { food: 3 } },
}
