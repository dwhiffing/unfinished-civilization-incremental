import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { Container, Button, Box } from '@material-ui/core'

import { drag, createInitial, tick } from './actions'
import store, { persistor } from './store'

import './index.css'
import { Routes } from './routes'
import { PersistGate } from 'redux-persist/integration/react'
import { INTERVAL } from './data'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(createInitial())
  }, [dispatch])

  useEffect(() => {
    const id = setInterval(() => {
      dispatch(tick())
    }, INTERVAL)
    return () => clearInterval(id)
  }, [dispatch])

  return (
    <Container>
      <DragDropContext
        onDragEnd={({ source, destination, ...rest }) =>
          dispatch(drag({ source, destination, ...rest }))
        }
      >
        <Routes />
        <Box position="fixed" bottom={0} right={0}>
          <Button
            onClick={() => {
              persistor.purge()
              localStorage.removeItem('hasSession')
              window.location = '/#/city/0'
              window.location.reload()
            }}
          >
            Clear save
          </Button>
        </Box>
      </DragDropContext>
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
