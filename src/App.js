import React from 'react'
import './App.css'
import { AppWrapper } from './styles/AppStyled'
import Files from './Files'
import styled from 'styled-components'
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom'

export const Button = styled.div`
  background-color: #61dafb;
  color: black;
  cursor: pointer;
  margin: 4%;
`

const App = () => {
  return (
    <div className='App'>
      <AppWrapper>
        <Router>
          <h1>Web Admin</h1>
          <Switch>
            <Route exact path='/'>
              <div className='menu'>
                <Link to='/files' className='link'>
                  <Button>Files</Button>
                </Link>
                <Link to='/health' className='link'>
                  <Button>Health</Button>
                </Link>
              </div>
            </Route>
            <Route path='/files' component={Files} />
          </Switch>
        </Router>
      </AppWrapper>
    </div>
  )
}

export default App
