import { INTERVAL } from './constants'
import clamp from 'lodash/clamp'
import get from 'lodash/get'
import set from 'lodash/set'

export const getActions = (update, getState) => {
  let actions = {}

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
            ? {
                ...resource,
                value: resource.value + task.effect.value * (task.amount + 1),
              }
            : resource
        }),
        tasks: getState().tasks.map((t) => ({
          ...t,
          progress: t.label === task.label ? 0 : t.progress,
        })),
      }
    })
  }

  actions.startTask = (taskLabel) => {
    update((state) => ({
      ...state,
      tasks: getState().tasks.map((b) => ({
        ...b,
        progress: b.label === taskLabel ? b.progress + 0.01 : b.progress,
      })),
    }))
  }

  actions.addTask = (taskLabel, amount) => {
    update((state) => ({
      ...state,
      tasks: getState().tasks.map((b) => ({
        ...b,
        amount:
          b.label === taskLabel ? clamp(b.amount + amount, 0, 100) : b.amount,
      })),
    }))
  }

  actions.onDragEnd = ({ source, destination }) => {
    if (!destination) return

    if (source.droppableId === destination.droppableId) {
      update((state) =>
        set(
          state,
          source.droppableId,
          reorder(
            get(state, source.droppableId),
            source.index,
            destination.index,
          ),
        ),
      )
    } else {
      update((state) => {
        return {
          ...state,
          ...move(
            state,
            get(state, source.droppableId),
            get(state, destination.droppableId),
            source,
            destination,
          ),
        }
      })
    }
  }

  return actions
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const move = (
  state,
  source,
  destination,
  droppableSource,
  droppableDestination,
) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = { ...state }
  set(result, droppableSource.droppableId, sourceClone)
  set(result, droppableDestination.droppableId, destClone)

  return result
}
