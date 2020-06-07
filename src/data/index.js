import sample from 'lodash/sample'
export { CITIES } from './cities'
export { PLANETS } from './planets'
export { CONTINENTS } from './continents'

export const getUniqueName = (model, list) => {
  const takenNames = model
    .all()
    .toRefArray()
    .map((p) => p.label)
  return sample(list.filter((p) => !takenNames.includes(p)))
}
