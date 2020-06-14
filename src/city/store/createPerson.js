import faker from 'faker'
export const createPersonReducer = (sess, { cityId, person }) => {
  sess.Person.create({ label: faker.name.firstName(), ...person, cityId })
  return sess.state
}
