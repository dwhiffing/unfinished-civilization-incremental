import { Box, Container } from '@material-ui/core'
import { useInterval } from '../utils/useInterval'
import { INTERVAL } from '../utils/constants'
import { Route, HashRouter as Router } from 'react-router-dom'
import { Resources } from './Resources'
import { Tasks } from './Tasks'

import React from 'react'
import { List } from './DragDrop'
import { DragDropContext } from 'react-beautiful-dnd'

const People = (props) => <List droppableId="people" items={props.people} />

function App({ state, actions }) {
  useInterval(actions.tick, INTERVAL)

  return (
    <Router>
      <Container>
        <DragDropContext onDragEnd={actions.onDragEnd}>
          <Box display="flex" flexDirection="row" minHeight="100vh">
            <Box display="flex" flexDirection="column" flex={1} p={1}>
              <People people={state.people} />
              <Resources resources={state.resources} />
            </Box>
            <Box flex={3} p={1}>
              <Route
                exact
                path="/"
                render={() => <Tasks actions={actions} state={state} />}
              />
            </Box>
          </Box>
        </DragDropContext>
      </Container>
    </Router>
  )
}
export default App
