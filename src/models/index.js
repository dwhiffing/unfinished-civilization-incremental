import { ORM } from 'redux-orm'
import { Task } from './Task'
import { Seat } from './Seat'
import { BuildingType } from './BuildingType'
import { Building } from './Building'
import { City } from './City'
import { Continent } from './Continent'
import { Resource } from './Resource'
import { Buyable } from './Buyable'
import { ResourceStockpile } from './ResourceStockpile'
import { Person } from './Person'
import { Planet } from './Planet'

const orm = new ORM({ stateSelector: (state) => state.root })
orm.register(
  Task,
  Building,
  Resource,
  Person,
  Planet,
  Seat,
  BuildingType,
  ResourceStockpile,
  City,
  Buyable,
  Continent,
)

export default orm
