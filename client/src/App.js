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
import { sizing } from '@material-ui/system';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#86af49' },
    default: { main: '#bdcebe' }
  },
  overrides: {
    MuiButton: {
      root: {
        marginTop: "10px",
        borderColor: "black"
      }
    },
    MuiBox: {
      root: {
        backgroundColor: "#e3eaa7",
        padding: "10px",
        height:'100%'
      }
    }
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.setMode = this.setMode.bind(this)
    this.onFlashDeckSelected = this.onFlashDeckSelected.bind(this)
  }
  setMode() {
    this.setState({ mode: 'EDIT' })
  }
  onFlashDeckSelected(flashDeckId, mode){
    this.setState({flashDeckId: flashDeckId, mode: mode})
  }
  render() {
    console.log('APP.JS RENDER this.state', this.state);
    let renderable = <Home setMode={this.setMode} onFlashDeckSelected={this.onFlashDeckSelected} />
    if (this.state.mode == 'EDIT' || this.state.mode == 'TEST' ) {
      renderable = <FlashDeck
        flashDeckId={this.state.flashDeckId}
        mode={this.state.mode}
      />
    }
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Box height="100%">
            {renderable}
          </Box>
        </ThemeProvider>
      </Provider>
    )
  }
}
