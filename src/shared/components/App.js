import React, { useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { Container, Button, Box } from '@material-ui/core'
import { drag } from '../../city/store'
import { createInitial, tick } from '../store'
import { persistor } from '../../store'
import { Routes } from '../../routes'
import { INTERVAL } from '../../shared/data'
export const App = () => {
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
