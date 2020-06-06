import { Model, many, attr } from 'redux-orm'
export class Continent extends Model {}
// TODO: Add plot model, and move city to plot
// a continent will have many cities through plots
// and cities can only be built on empty plots
// plots will provide available resources to cities
// - Resources
//   - size, type
// - features
//   - land, water, mountain, forest, desert, tundra
Continent.modelName = 'Continent'
Continent.fields = {
  id: attr(),
  cities: many('City', 'continent'),
}
