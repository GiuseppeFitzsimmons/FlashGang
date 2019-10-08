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
import {greenTheme} from './views/widgets/Themes'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme:greenTheme
    }
    this.setMode = this.setMode.bind(this)
  }
  setMode() {
    this.setState({ mode: 'flashdeck' })
  }

  render() {
    let renderable = <Home setMode={this.setMode} />
    if (this.state.mode == 'flashdeck') {
      renderable = <FlashDeck
        flashDeckId={this.state.flashdeckId}
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
