import { INTERVAL } from './constants'

export const getActions = (update, getState) => {
  let actions = {}

  const state = getState()

  actions.tick = () => {
    return update((state) => ({
      ...state,
      tasks: state.tasks.map((b) => ({
        ...b,
        progress: b.progress > 0 ? b.progress + INTERVAL : b.progress,
      })),
    }))
  }

  actions.finishTask = (task) => {
    return update((state) => {
      return {
        ...state,
        resources: state.resources.map((resource) => {
          return task.effect.label === resource.label
            ? { ...resource, value: resource.value + task.effect.value }
            : resource
        }),
        tasks: getState().tasks.map((t) => ({
          ...t,
          progress: t.label === task.label ? 0 : t.progress,
        })),
      }
    })
  }

  state.tasks.forEach((task) => {
    actions[`startTask${task.label}`] = () =>
      update((state) => ({
        ...state,
        tasks: getState().tasks.map((b) => ({
          ...b,
          progress: b.label === task.label ? b.progress + 0.01 : b.progress,
        })),
      }))
  })

  return actions
}
