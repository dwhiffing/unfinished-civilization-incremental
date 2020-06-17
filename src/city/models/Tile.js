import { Model, attr, fk, oneToOne } from 'redux-orm'

export class Tile extends Model {}
Tile.modelName = 'Tile'
Tile.fields = {
  cityId: fk({ to: 'City', as: 'city', relatedName: 'tiles' }),
  personId: oneToOne({ to: 'Person', as: 'person', relatedName: 'tile' }),
}
