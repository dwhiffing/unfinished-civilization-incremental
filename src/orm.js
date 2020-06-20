import { ORM } from 'redux-orm'
import { Tile, City, Building, ResourceStockpile, Person } from './city/models'
import { DistrictType, District } from './city/models'
import { Continent, Plot } from './continent/models'
import { Buyable, Resource, Unlock } from './shared/models'
import { Planet } from './planet/models'
import { System } from './system/models'

const orm = new ORM({ stateSelector: (state) => state.root })
orm.register(
  District,
  Resource,
  Person,
  Planet,
  System,
  Unlock,
  Plot,
  Building,
  Tile,
  DistrictType,
  ResourceStockpile,
  City,
  Buyable,
  Continent,
)

export default orm
