import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './views/home';
import FlashDeck from './views/flashdeck';
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
  }
  createFlashDeck() {
    this.setState({ mode: 'EDIT' })
  }
  onFlashDeckSelected(flashDeckId, mode) {
    this.setState({ flashDeckId: flashDeckId, mode: mode })
  }
  goHome(){
    this.setState({mode:''})
  }
  render() {
    let renderable = <Home onNewButton={this.createFlashDeck} onFlashDeckSelected={this.onFlashDeckSelected} />
    if (this.state.mode == 'EDIT' || this.state.mode == 'TEST') {
      renderable = <FlashDeck
        goHome = {this.goHome}
        flashDeckId={this.state.flashDeckId}
        mode={this.state.mode}
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