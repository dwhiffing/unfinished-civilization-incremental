import React from 'react'
import { Route } from 'react-router-dom'
import { City } from './City'
import { Nation } from './Nation'
import { Planet } from './Planet'

export const Routes = () => (
  <>
    <Route exact path="/" render={() => <Planet />} />
    <Route exact path="/nation/:id" render={() => <Nation />} />
    <Route exact path="/city/:id" render={() => <City />} />
  </>
)
