import React from 'react'
import { Route } from 'react-router-dom'
import { City } from './City'
import { CityList } from './CityList'

export const Routes = () => (
  <>
    <Route exact path="/city" render={() => <CityList />} />
    <Route exact path="/city/:id" render={() => <City id="city" />} />
  </>
)
