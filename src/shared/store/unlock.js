const BLACKLIST = ['growth']
export const unlockReducer = (sess, payload = {}) => {
  if (!sess.Unlock.withId(payload) && !BLACKLIST.includes(payload)) {
    sess.Unlock.create({ id: payload })
  }
  return sess.state
}
