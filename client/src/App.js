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
import SynchroniseComponent from './views/components/synchronisecomponent';
import Settings from './views/components/settings';

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
class NavEvent {
  push(title) {
    window.history.pushState({page: window.history.length}, title, "")
  }
  onBackButtonEvent(e) {
    //alert(window.history.length);
    if (this.backButton) {
      e.preventDefault();
      this.backButton();
    }
  }
  clear() {
    var _len=window.history.length;
    //while (_len-->2) {
     // alert(_len);
     // window.history.back();
    //}
    //alert(window.history.replaceState())
    //window.history.clear();
  }
}
const navEvent=new NavEvent();

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
    this.goSettings = this.goSettings.bind(this)
    this.callSynchronise = false
    this.navEvent=navEvent;
  }
  logOut() {
    console.log("Logging out bug before", Object.entries(localStorage).length);
    localStorage.clear();
    console.log("Logging out bug after", Object.entries(localStorage).length);
    //window.location.href = '/'
    this.setState({ mode: '', flashDeckId: null })
  }
  createFlashDeck() {
    this.navEvent.push("DECK");
    this.setState({ mode: 'EDIT', flashDeckId: null })
  }
  onFlashDeckSelected(flashDeckId, mode, source) {
    this.navEvent.push("DECK");
    this.setState({ flashDeckId: flashDeckId, mode: mode, source: source })
  }
  onFlashGangSelected(flashGangId) {
    this.navEvent.push("GANG");
    this.setState({ flashGangId: flashGangId, mode: 'EDITGANG' })
  }
  createFlashGang() {
    this.navEvent.push("GANG");
    this.setState({ mode: 'EDITGANG', flashGangId: null })
  }
  goHome() {
    this.navEvent.clear();
    this.setState({ mode: '' })
  }
  goGangs() {
    this.navEvent.push("GANGS");
    this.setState({ mode: 'GANGS' })
  }
  goSettings() {
    this.navEvent.push("SETTINGS");
    this.setState({ mode: 'SETTINGS' })
  }
  onLoggedIn() {
    this.forceUpdate()
  }
  checkIfUserIsInScope() {
    if (this.loggedIn) {
      //  return true
    }
    let cookie = Cookies();
    console.log("COOKIES", cookie);
    if (cookie.socialLogin) {
      let parsedCookie = JSON.parse(cookie.socialLogin)
      localStorage.setItem("flashJwt", JSON.stringify(parsedCookie.jwt))
      localStorage.setItem("flashJwtRefresh", JSON.stringify(parsedCookie.refresh))
      localStorage.setItem("currentUser", JSON.stringify(parsedCookie.user))
      eraseCookie('socialLogin')
      this.callSynchronise = true
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
    }, 1000);
    window.onpopstate = function (e) {
      navEvent.onBackButtonEvent(e);
    };
  }
  render() {
    const loggedIn = this.checkIfUserIsInScope()
    let renderable = <Home
      onNewButton={this.createFlashDeck}
      onFlashDeckSelected={this.onFlashDeckSelected}
      goGangs={this.goGangs}
      onLogOut={this.logOut}
      goSettings={this.goSettings}
    />
    if (!loggedIn) {
      renderable = <Login onLoggedIn={this.onLoggedIn}
        onLogOut={this.logOut}
      />
    } else if (this.state.mode == 'EDIT' || this.state.mode == 'TEST') {
      renderable = <FlashDeck
        goHome={this.goHome}
        onFlashDeckSelected={this.onFlashDeckSelected}
        flashDeckId={this.state.flashDeckId}
        source={this.state.source}
        mode={this.state.mode}
        goGangs={this.goGangs}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        navEvent={this.navEvent}
      />
    } else if (this.state.mode == 'GANGS') {
      renderable = <FlashGangs
        onFlashGangSelected={this.onFlashGangSelected}
        goHome={this.goHome}
        createFlashGang={this.createFlashGang}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        navEvent={this.navEvent}
      />
    } else if (this.state.mode == 'EDITGANG') {
      renderable = <FlashGangEditor
        onFlashDeckSelected={this.onFlashDeckSelected}
        goHome={this.goHome}
        flashGangId={this.state.flashGangId}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        goGangs={this.goGangs}
        navEvent={this.navEvent}
      />
    } else if (this.state.mode == 'SETTINGS') {
      renderable = <Settings
        onLogOut={this.logOut}
        goHome={this.goHome}
        goGangs={this.goGangs}
        navEvent={this.navEvent}
      />
    }
    //renderable=<TestGrid/>
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme ? this.state.theme : greenTheme}>
          <Box height={'1'} style={{ overflow: 'hidden' }}>
            <SynchroniseComponent
              callSynchronise={this.callSynchronise}
            />
            <SplashScreen showing={this.state.splashScreenShowing} />
            {renderable}
          </Box>
        </ThemeProvider>
      </Provider>
    )
  }
}