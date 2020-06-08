import React from 'react'
import { Route } from 'react-router-dom'
import { City } from './City'
import { Continent } from './Continent'
import { Planet } from './Planet'
import { System } from './System'
import { Galaxy } from './Galaxy'

export const Routes = () => (
  <>
    <Route exact path="/" render={() => <Galaxy />} />
    <Route exact path="/system/:id" render={() => <System />} />
    <Route exact path="/planet/:id" render={() => <Planet />} />
    <Route exact path="/continent/:id" render={() => <Continent />} />
    <Route exact path="/city/:id" render={() => <City />} />
  </>
)
