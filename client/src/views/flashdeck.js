import React from 'react';
//import logo from './logo.svg';
import '../App.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import FlashDeckEditor from './components/flashdeckeditor'
import FlashCardEditor from './components/flashcardeditor'

class FlashDeck extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    if (!this.props.flashDeckId) {
      this.props.newDeck()
    }
  }
  render() {
    let renderable = <FlashDeckEditor flashDeck={this.props.flashDeck} />
    if (this.props.flashDeck && this.props.flashDeck.hasOwnProperty('currentIndex')) {
      renderable = <FlashCardEditor flashDeck={this.props.flashDeck} />
    }
    return (
      <>
        {renderable}
      </>
    )
  }
}

function mapStateToProps(state, props) {
  return { flashDeck: state.flashDeck }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashDeck)