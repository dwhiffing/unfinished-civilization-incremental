import faker from 'faker'
import { createCity } from './createCity'
export const createContinent = (sess, continent = {}) => {
  const continentInstance = sess.Continent.create({
    ...continent,
    label: faker.address.city(),
  })
  createCity(sess, { continentId: continentInstance.ref.id })
  return sess.state
}
