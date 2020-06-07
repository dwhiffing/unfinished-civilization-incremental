import { Model, many, attr } from 'redux-orm'
export class Plot extends Model {}
// TODO:
// plots will provide available resources to cities
// - Resources
//   - size, type
// - features
//   - land, water, mountain, forest, desert, tundra
Plot.modelName = 'Plot'
Plot.fields = {
  id: attr(),
  cities: many('City', 'plot'),
}
