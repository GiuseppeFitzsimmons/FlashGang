import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './views/home';
import FlashDeck from './views/flashdeck';
import FlashGangs from './views/flashgangs';
import FlashGangEditor from './views/components/flashgangeditor';
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
  }
  createFlashDeck() {
    this.setState({ mode: 'EDIT', flashDeckId: null })
  }
  onFlashDeckSelected(flashDeckId, mode) {
    this.setState({ flashDeckId: flashDeckId, mode: mode })
  }
  createFlashGang() {
    this.setState({ mode: 'EDITGANG', flashGangId: null })
  }
  goHome(){
    this.setState({mode:''})
  }
  goGangs(){
    this.setState({mode:'GANGS'})
  }
  render() {
    let renderable = <Home 
        onNewButton={this.createFlashDeck} 
        onFlashDeckSelected={this.onFlashDeckSelected}
        goGangs = {this.goGangs}/>
    if (this.state.mode == 'EDIT' || this.state.mode == 'TEST') {
      renderable = <FlashDeck
        goHome = {this.goHome}
        flashDeckId={this.state.flashDeckId}
        mode={this.state.mode}
        goGangs = {this.goGangs}
      />
    } else if (this.state.mode == 'GANGS'){
      renderable = <FlashGangs
      goHome = {this.goHome}
      createFlashGang={this.createFlashGang}
      />
    } else if (this.state.mode == 'EDITGANG'){
      renderable = <FlashGangEditor
      goHome = {this.goHome}
      flashGangId={this.state.flashGangId}
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