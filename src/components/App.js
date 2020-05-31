import React from 'react'
import { Route, HashRouter as Router } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Container } from '@material-ui/core'

import { Resources } from './Resources'
import { Buildings } from './Buildings'
import { People } from './People'
import { getBuildings, getPeople, getResources } from '../utils/selectors'

export default function App() {
  const dispatch = useDispatch()
  const buildings = useSelector((state) => getBuildings(state))
  const resources = useSelector((state) => getResources(state))
  const people = useSelector((state) => getPeople(state))

  return (
    <Router>
      <Container>
        <DragDropContext
          onDragEnd={({ source, destination, ...rest }) =>
            dispatch({
              type: 'DRAG',
              payload: { source, destination, ...rest },
            })
          }
        >
          <Box display="flex" flexDirection="row" minHeight="100vh">
            <Box display="flex" flexDirection="column" flex={1} p={1}>
              <People people={people} />
              <Resources resources={resources} />
            </Box>
            <Box flex={3} p={1}>
              <Route
                exact
                path="/"
                render={() => <Buildings buildings={buildings} />}
              />
            </Box>
          </Box>
        </DragDropContext>
      </Container>
    </Router>
  )
}
App.whyDidYouRender = true
