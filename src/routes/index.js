import React from 'react'
import { Route } from 'react-router-dom'
import { City } from './City'
import { Continent } from './Continent'
import { Planet } from './Planet'

export const Routes = () => (
  <>
    <Route exact path="/" render={() => <Planet />} />
    <Route exact path="/continent/:id" render={() => <Continent />} />
    <Route exact path="/city/:id" render={() => <City />} />
  </>
)
