import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './views/home';
import FlashDeck from './views/flashdeck';
import { Provider } from 'react-redux';
import store from './store';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.setMode = this.setMode.bind(this)
  }
  setMode() {
    this.setState({ mode: 'flashdeck' })
  }

  render() {
    let renderable = <Home setMode={this.setMode} />
    if (this.state.mode == 'flashdeck') {
      renderable = <FlashDeck
        id={this.state.flashdeckId}
        mode={this.state.mode}
      />
    }
    return (
      <Provider store={store}>
        {renderable}
      </Provider>
    )
  }
}
