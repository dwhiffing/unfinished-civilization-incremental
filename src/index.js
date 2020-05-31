import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { Container } from '@material-ui/core'

import { drag, init } from './actions'
import store from './store'

import './index.css'
import { Routes } from './routes'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(init())
  }, [dispatch])

  return (
    <Container>
      <DragDropContext
        onDragEnd={({ source, destination, ...rest }) =>
          dispatch(drag({ source, destination, ...rest }))
        }
      >
        <Routes />
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
