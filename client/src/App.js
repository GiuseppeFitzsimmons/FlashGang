import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './views/home';
import FlashDeck from './views/flashdeck';
import FlashGangs from './views/flashgangs';
import FlashGangEditor from './views/components/flashgangeditor';
import Login from './views/components/login';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import { greenTheme } from './views/widgets/Themes'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.createFlashDeck = this.createFlashDeck.bind(this)
    this.onFlashDeckSelected = this.onFlashDeckSelected.bind(this)
    this.goHome = this.goHome.bind(this)
    this.goGangs = this.goGangs.bind(this)
    this.createFlashGang = this.createFlashGang.bind(this)
    this.onFlashGangSelected = this.onFlashGangSelected.bind(this)
    this.onLoggedIn = this.onLoggedIn.bind(this)
    this.logOut = this.logOut.bind(this)
  }
  logOut() {
    localStorage.clear();
    this.setState({ mode: '', flashDeckId: null })
  }
  createFlashDeck() {
    this.setState({ mode: 'EDIT', flashDeckId: null })
  }
  onFlashDeckSelected(flashDeckId, mode) {
    this.setState({ flashDeckId: flashDeckId, mode: mode })
  }
  onFlashGangSelected(flashGangId) {
    this.setState({ flashGangId: flashGangId, mode: 'EDITGANG' })
  }
  createFlashGang() {
    this.setState({ mode: 'EDITGANG', flashGangId: null })
  }
  goHome() {
    this.setState({ mode: '' })
  }
  goGangs() {
    this.setState({ mode: 'GANGS' })
  }
  onLoggedIn() {
    this.forceUpdate()
  }
  checkIfUserIsnScope() {
    if (this.loggedIn) {
      //  return true
    }
    var _jwt = localStorage.getItem("flashJwt");
    if (!_jwt) {
      this.loggedIn = false
    } else {
      this.loggedIn = true
    }
    return this.loggedIn
  }
  render() {
    const loggedIn = this.checkIfUserIsnScope()
    let renderable = <Home
      onNewButton={this.createFlashDeck}
      onFlashDeckSelected={this.onFlashDeckSelected}
      goGangs={this.goGangs}
      onLogOut={this.logOut}
    />
    if (!loggedIn) {
      renderable = <Login onLoggedIn={this.onLoggedIn}
        onLogOut={this.logOut}
      />
    } else if (this.state.mode == 'EDIT' || this.state.mode == 'TEST') {
      renderable = <FlashDeck
        goHome={this.goHome}
        flashDeckId={this.state.flashDeckId}
        mode={this.state.mode}
        goGangs={this.goGangs}
        onLogOut={this.logOut}
      />
    } else if (this.state.mode == 'GANGS') {
      renderable = <FlashGangs
        onFlashGangSelected={this.onFlashGangSelected}
        goHome={this.goHome}
        createFlashGang={this.createFlashGang}
        onLogOut={this.logOut}
      />
    } else if (this.state.mode == 'EDITGANG') {
      renderable = <FlashGangEditor
        goHome={this.goHome}
        flashGangId={this.state.flashGangId}
        onLogOut={this.logOut}
      />
    }
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme ? this.state.theme : greenTheme}>
          <Box height="100%">
            {renderable}
          </Box>
        </ThemeProvider>
      </Provider>
    )
  }
}