import React from 'react'
import { Box, Container } from '@material-ui/core'
import { useInterval } from '../utils/useInterval'
import { INTERVAL } from '../utils/constants'
import { Route, HashRouter as Router } from 'react-router-dom'
import { Resources } from './Resources'
import { Tasks } from './Tasks'

function App({ state, actions }) {
  useInterval(actions.tick, INTERVAL)

  return (
    <Router>
      <Container>
        <Box display="flex" flexDirection="row" minHeight="100vh">
          <Box display="flex" flexDirection="column" flex={1} p={1}>
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
      </Container>
    </Router>
  )
}

export default App
