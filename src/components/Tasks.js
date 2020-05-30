import React from 'react'
import { Box, Typography, Button } from '@material-ui/core'
import { INTERVAL } from '../utils/constants'
import { List } from './DragDrop'

export const Tasks = ({ actions, state }) => (
  <>
    {state.buildings.map((building) => (
      <div key={building.label}>
        <Typography>{building.label}</Typography>

        {building.tasks.map((buildingTask) => {
          const taskDefinition = state.tasks.find(
            (t) => t.label === buildingTask.label,
          )
          const task = { ...taskDefinition, ...buildingTask }
          return (
            <TaskItem
              key={`task-${task.label}`}
              task={task}
              building={building}
              items={state.buildings[0].tasks[0].slots}
              onClick={() => actions.startTask(task.label)}
              onAdd={() => actions.addTask(task.label, +1)}
              onSub={() => actions.addTask(task.label, -1)}
            />
          )
        })}
      </div>
    ))}
  </>
)

function TaskItem({ task, items, onClick, onAdd, onSub }) {
  const progress = 1 - task.progress / (task.duration * 1000)
  return (
    <Box display="flex" flexDirection="column" flex={1} maxWidth={300}>
      <Box
        style={{
          flex: 1,
          margin: 8,
          position: 'relative',
          backgroundColor: 'lightgray',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <List droppableId={`buildings[0].tasks[0].slots`} items={items} />
        {typeof progress === 'number' && (
          <Box
            position="absolute"
            bgcolor="green"
            top={0}
            left={0}
            bottom={0}
            style={{ transition: `right ${INTERVAL - 1}ms` }}
            right={`${progress * 100}%`}
          />
        )}
        <Box position="relative" zIndex={1}>
          <Typography>{task.label}</Typography>
          <Typography>{task.amount}</Typography>
        </Box>
      </Box>
      <Box display="flex" flex={1}>
        <Button onClick={onClick}>Perform</Button>
        <Button onClick={onAdd}>Add</Button>
        <Button onClick={onSub}>Sub</Button>
      </Box>
    </Box>
  )
}
