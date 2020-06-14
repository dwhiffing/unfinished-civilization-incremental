import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CityRoute } from './city/components/CityRoute'
import { ContinentRoute } from './continent/components/ContinentRoute'
import { PlanetRoute } from './planet/components/PlanetRoute'
import { SystemRoute } from './system/components/SystemRoute'
import { GalaxyRoute } from './shared/components/GalaxyRoute'
import { useSelector } from 'react-redux'
import { getUnlocks } from './shared/selectors'
import { Box } from '@material-ui/core'
import { PlanetSidebar } from './planet/components/PlanetSidebar'
import { ContinentSidebar } from './continent/components/ContinentSidebar'
import { CitySidebar } from './city/components/CitySidebar'
import { SystemSidebar } from './system/components/SystemSidebar'
import { GalaxySidebar } from './shared/components/GalaxySidebar'
import { Frame } from './shared/components/Frame'

export const Routes = () => {
  const unlocks = useSelector(getUnlocks)

  return (
    <Frame
      sidebar={
        <Switch>
          {unlocks.includes('system') && (
            <Route exact path="/system/:id" render={() => <SystemSidebar />} />
          )}
          {unlocks.includes('planet') && (
            <Route exact path="/planet/:id" render={() => <PlanetSidebar />} />
          )}
          {unlocks.includes('continent') && (
            <Route
              exact
              path="/continent/:id"
              render={() => <ContinentSidebar />}
            />
          )}
          <Route exact path="/city/:id" render={() => <CitySidebar />} />
          <Route
            path="*"
            render={() => {
              if (unlocks.includes('galaxy')) return <GalaxySidebar />
              if (unlocks.includes('system')) return <SystemSidebar />
              if (unlocks.includes('planet')) return <PlanetSidebar />
              if (unlocks.includes('continent')) return <ContinentSidebar />
              return <CitySidebar />
            }}
          />
        </Switch>
      }
    >
      <Box flex={7} p={1}>
        <Switch>
          {unlocks.includes('system') && (
            <Route exact path="/system/:id" render={() => <SystemRoute />} />
          )}
          {unlocks.includes('planet') && (
            <Route exact path="/planet/:id" render={() => <PlanetRoute />} />
          )}
          {unlocks.includes('continent') && (
            <Route
              exact
              path="/continent/:id"
              render={() => <ContinentRoute />}
            />
          )}
          <Route exact path="/city/:id" render={() => <CityRoute />} />
          <Route
            path="*"
            render={() => {
              if (unlocks.includes('galaxy')) return <GalaxyRoute />
              if (unlocks.includes('system')) return <SystemRoute />
              if (unlocks.includes('planet')) return <PlanetRoute />
              if (unlocks.includes('continent')) return <ContinentRoute />
              return <CityRoute />
            }}
          />
        </Switch>
      </Box>
    </Frame>
  )
}
