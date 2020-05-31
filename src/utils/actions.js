export const init = () => ({ type: 'INIT' })

export const drag = (payload) => ({ type: 'DRAG', payload })

export const finishTask = ({ resourceId, value }) => ({
  type: 'FINISH_TASK',
  payload: { resourceId, value },
})
