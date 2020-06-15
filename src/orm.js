import { ORM } from 'redux-orm'
import { City, ResourceStockpile, Person } from './city/models'
import { Task, Seat, DistrictType, District } from './district/models'
import { Continent, Plot } from './continent/models'
import { Buyable, Resource, Unlock } from './shared/models'
import { Planet } from './planet/models'
import { System } from './system/models'

const orm = new ORM({ stateSelector: (state) => state.root })
orm.register(
  Task,
  District,
  Resource,
  Person,
  Planet,
  System,
  Unlock,
  Plot,
  Seat,
  DistrictType,
  ResourceStockpile,
  City,
  Buyable,
  Continent,
)

export default orm
