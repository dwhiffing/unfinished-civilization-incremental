import { ORM } from 'redux-orm'
import { Task } from './Task'
import { Seat } from './Seat'
import { BuildingType } from './BuildingType'
import { Building } from './Building'
import { City } from './City'
import { Nation } from './Nation'
import { Resource } from './Resource'
import { Buyable } from './Buyable'
import { ResourceStockpile } from './ResourceStockpile'
import { Person } from './Person'

const orm = new ORM({ stateSelector: (state) => state.root })
orm.register(
  Task,
  Building,
  Resource,
  Person,
  Seat,
  BuildingType,
  ResourceStockpile,
  City,
  Buyable,
  Nation,
)

export default orm
