import React from 'react'
import { Route } from 'react-router-dom'
import { City } from './City'
import { Continent } from './Continent'
import { Planet } from './Planet'
import { System } from './System'

export const Routes = () => (
  <>
    <Route exact path="/" render={() => <System />} />
    <Route exact path="/planet/:id" render={() => <Planet />} />
    <Route exact path="/continent/:id" render={() => <Continent />} />
    <Route exact path="/city/:id" render={() => <City />} />
  </>
)
