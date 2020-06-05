import faker from 'faker'
export const createPerson = (sess, { cityId, person }) => {
  const city = sess.City.withId(cityId)
  const personInstance = sess.Person.create({
    label: faker.name.firstName(),
    ...person,
  })
  city.people.add(personInstance)
  return sess.state
}
