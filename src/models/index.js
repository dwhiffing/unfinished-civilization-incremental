import { ORM } from 'redux-orm'
import { Task } from './Task'
import { Seat } from './Seat'
import { DistrictType } from './DistrictType'
import { District } from './District'
import { City } from './City'
import { Continent } from './Continent'
import { Resource } from './Resource'
import { Buyable } from './Buyable'
import { ResourceStockpile } from './ResourceStockpile'
import { Person } from './Person'
import { Plot } from './Plot'
import { Planet } from './Planet'
import { System } from './System'
import { Unlock } from './Unlock'

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
