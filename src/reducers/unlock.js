export const unlock = (sess, payload = {}) => {
  if (!sess.Unlock.withId(payload.id)) {
    sess.Unlock.create({ id: payload })
  }
  return sess.state
}
