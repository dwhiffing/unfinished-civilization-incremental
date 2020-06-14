export const totalResources = (piles) => {
  let resources = {}
  piles.forEach((pile) => {
    const { amount, limit, resourceId, color } = pile
    resources[resourceId] = resources[resourceId] || {
      amount: 0,
      limit: 0,
      //TODO
      color,
    }
    resources[resourceId].amount += amount
    resources[resourceId].limit += limit
  })
  return resources
}
