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

import { Grid } from '@material-ui/core';
import FlashAppBar from './views/widgets/flashappbar'
import SplashScreen from './views/components/splashscreen';

function Cookies() {
  const split = document.cookie.split(';');
  const cookie = {};
  for (let index in split) {
    let splitedValue = split[index].split('=');
    if (splitedValue.length > 1) {
      cookie[splitedValue[0].trim()] = splitedValue[1].trim();
    }
  }
  return cookie;
}

function eraseCookie(name) { document.cookie = name + '=; Max-Age=-99999999;'; }


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { splashScreenShowing: true }
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
    window.location.href = '/'
    this.setState({ mode: '', flashDeckId: null })
  }
  createFlashDeck() {
    this.setState({ mode: 'EDIT', flashDeckId: null })
  }
  onFlashDeckSelected(flashDeckId, mode, source) {
    this.setState({ flashDeckId: flashDeckId, mode: mode, source: source })
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
  checkIfUserIsInScope() {
    if (this.loggedIn) {
      //  return true
    }
    let cookie = Cookies()
    if (cookie.socialLogin){
      let parsedCookie = JSON.parse(cookie.socialLogin)
      localStorage.setItem("flashJwt", JSON.stringify(parsedCookie.jwt))
      localStorage.setItem("flashJwtRefresh", JSON.stringify(parsedCookie.refresh))
      localStorage.setItem("currentUser", JSON.stringify(parsedCookie.user))
      eraseCookie('socialLogin')
    }
    var _jwt = localStorage.getItem("flashJwt");
    if (!_jwt) {
      this.loggedIn = false
    } else {
      this.loggedIn = true
    }
    return this.loggedIn
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ splashScreenShowing: false })
    }, 150)
  }
  render() {
    const loggedIn = this.checkIfUserIsInScope()
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
        source={this.state.source}
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
        onFlashDeckSelected={this.onFlashDeckSelected}
        goHome={this.goHome}
        flashGangId={this.state.flashGangId}
        onLogOut={this.logOut}
      />
    }
    //renderable=<TestGrid/>
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme ? this.state.theme : greenTheme}>
          <Box height={'1'} style={{ overflow: 'hidden' }}>
            <SplashScreen showing={this.state.splashScreenShowing} />
            {renderable}
          </Box>
        </ThemeProvider>
      </Provider>
    )
  }
}

class TestGrid extends React.Component {
  render() {
    return (
      <>
        <FlashAppBar title='FlashGang!' station='GANGS' />
        <Grid style={{ height: '100%', backgroundColor: 'red' }}>

        </Grid>
      </>
    )
  }
}
