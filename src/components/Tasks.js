import React from 'react'
import { Box } from '@material-ui/core'
import { CustomButton } from './CustomButton'

export const Tasks = ({ actions, state }) =>
  state.tasks.map((task) => (
    <Box key={`task-${task.label}`} display="flex" flex={1}>
      <CustomButton
        label={task.label}
        progress={1 - task.progress / (task.duration * 1000)}
        flex={2}
        onClick={() => actions[`startTask${task.label}`]()}
      />
    </Box>
  ))
