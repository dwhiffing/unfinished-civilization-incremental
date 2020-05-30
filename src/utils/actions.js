import { INTERVAL } from './constants'

import get from 'lodash/get'
import set from 'lodash/set'
import merge from './merge'

export const getTaskWithBuildingTask = (state, task) => {
  const building = state.buildings.find((b) =>
    b.tasks.some((t) => t.label === task.label),
  )
  const buildingTask = building
    ? building.tasks.find((t) => t.label === task.label)
    : null

  return { ...task, buildingTask }
}

export const getActions = (update, getState) => {
  let actions = {}

  const perform = (changes) => update((state) => merge(state, changes))

  actions.tick = () =>
    perform({
      tasks: (tasks) =>
        tasks.map((b) => ({
          ...b,
          progress: b.progress > 0 ? b.progress + INTERVAL : b.progress,
        })),
    })

  actions.finishTask = (task) => {
    const _task = getTaskWithBuildingTask(getState(), task)
    const multiplier = _task.buildingTask.slots.flat().length
    return perform({
      tasks: (tasks) =>
        tasks.map((t) => ({
          ...t,
          progress: t.label === task.label ? 0 : t.progress,
        })),
      resources: (resources) =>
        resources.map((resource) =>
          task.effect.label === resource.label
            ? {
                ...resource,
                value: resource.value + task.effect.value * multiplier,
              }
            : resource,
        ),
    })
  }

  actions.startTask = (task) => {
    perform({
      tasks: (tasks) =>
        tasks.map((b) => ({
          ...b,
          progress: b.label === task.label ? b.progress + 0.01 : b.progress,
        })),
    })
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
