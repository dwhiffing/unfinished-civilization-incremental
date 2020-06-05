import faker from 'faker'
import { createCity } from './createCity'
export const createNation = (sess, nation = {}) => {
  const nationInstance = sess.Nation.create({
    ...nation,
    label: faker.address.city(),
  })
  createCity(sess, { nationId: nationInstance.ref.id })
  return sess.state
}
