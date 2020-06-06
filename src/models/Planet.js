import { Model, many, attr } from 'redux-orm'
export class Planet extends Model {}
// TODO: a planet will have all its continents generated on creation
// they will have various sizes based on the size of the planet
// the player will have to explore to find new continents instead of creating them directly
Planet.modelName = 'Planet'
Planet.fields = {
  id: attr(),
  continents: many('Continent', 'planet'),
}
