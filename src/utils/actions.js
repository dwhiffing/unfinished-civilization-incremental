import { INTERVAL } from './constants'

import get from 'lodash/get'
import set from 'lodash/set'
import merge from './merge'

export const getTaskWithBuildingTask = (state, task) => {
  const building = Object.values(state.buildings).find(
    (b) => b.tasks[task.label],
  )

  return { ...task, buildingTask: building.tasks[task.label] }
}

export const getActions = (update, getState) => {
  let actions = {}

  const perform = (changes) => update((state) => merge(state, changes))

  actions.tick = () =>
    perform({
      tasks: (tasks) => {
        Object.values(tasks).forEach((task) => {
          if (task.progress > 0) {
            task.progress += INTERVAL
          }
        })
        return tasks
      },
    })

  actions.finishTask = (task) => {
    const _task = getTaskWithBuildingTask(getState(), task)
    const multiplier = _task.buildingTask.slots.map((s) => s.list).flat().length
    return perform({
      tasks: { [task.label]: { progress: 0 } },
      resources: {
        [task.effect.label]: {
          value: (v) => v + task.effect.value * multiplier,
        },
      },
    })
  }

  actions.startTask = (task) => {
    perform({ tasks: { [task.label]: { progress: (p) => p + 0.01 } } })
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
