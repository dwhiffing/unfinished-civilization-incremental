import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Root from './components/App'
import meiosis from 'meiosis-setup'
import { INITIAL_STATE } from './utils/constants'
import { getActions, getTaskWithBuildingTask } from './utils/actions'

const App = meiosis.react.setup({ React, Root })

const { states, update, actions } = meiosis.functionPatches.setup({
  stream: meiosis.simpleStream,
  app: {
    initial: INITIAL_STATE,
    Actions: getActions,
    Effects: (update, actions) => [
      (state) => {
        state.tasks.forEach((task) => {
          if (task.progress >= task.duration * 1000) {
            actions.finishTask(task)
          }
        })
      },
      (state) => {
        state.tasks.forEach((task) => {
          const _task = getTaskWithBuildingTask(state, task)
          if (
            task.progress === 0 &&
            _task.buildingTask.slots.flat().length > 0
          ) {
            actions.startTask(task)
          }
        })
      },
    ],
  },
})

ReactDOM.render(
  <React.StrictMode>
    <App states={states} update={update} actions={actions} />
  </React.StrictMode>,
  document.getElementById('root'),
)
