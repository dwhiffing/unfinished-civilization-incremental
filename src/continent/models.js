import { Model, attr, oneToOne, fk } from 'redux-orm'
export class Continent extends Model {}
Continent.modelName = 'Continent'
Continent.fields = {
  id: attr(),
  explored: attr(),
  biomes: attr(),
  planetId: fk({ to: 'Planet', as: 'planet', relatedName: 'continents' }),
}
export class Plot extends Model {}
Plot.modelName = 'Plot'
Plot.fields = {
  id: attr(),
  cityId: oneToOne({ to: 'City', as: 'city', relatedName: 'plot' }),
  continentId: fk({ to: 'Continent', as: 'continent', relatedName: 'plots' }),
}
