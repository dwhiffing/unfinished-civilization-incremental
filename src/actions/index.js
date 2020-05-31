export const init = () => ({ type: 'INIT' })

export const drag = (payload) => ({ type: 'DRAG', payload })

export const finishTask = ({ cityId, resourceId, value }) => ({
  type: 'FINISH_TASK',
  payload: { cityId, resourceId, value },
})
