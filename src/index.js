import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, HashRouter as Router } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { Box, Container } from '@material-ui/core'

import { Resources } from './components/Resources'
import { Buildings } from './components/Buildings'
import { People } from './components/People'
import { drag } from './actions'
import store from './store'

import './index.css'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

const App = () => {
  const dispatch = useDispatch()

  return (
    <Container>
      <DragDropContext
        onDragEnd={({ source, destination, ...rest }) =>
          dispatch(drag({ source, destination, ...rest }))
        }
      >
        <Box display="flex" flexDirection="row" minHeight="100vh">
          <Box display="flex" flexDirection="column" flex={1} p={1}>
            <Resources />
            <People />
          </Box>
          <Box flex={3} p={1}>
            <Route exact path="/" render={() => <Buildings />} />
          </Box>
        </Box>
      </DragDropContext>
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
