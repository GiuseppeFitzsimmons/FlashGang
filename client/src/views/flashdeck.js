import React from 'react';
//import logo from './logo.svg';
import '../App.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import FlashDeckEditor from './components/flashdeckeditor'
import FlashCardEditor from './components/flashcardeditor'
import FlashDeckTest from './components/flashdecktest';

class FlashDeck extends React.Component {
  constructor(props) {
    super(props)
    this.editFlashDeck = this.editFlashDeck.bind(this)
  }
  componentDidMount() {
    if (!this.props.flashDeckId) {
      this.props.newDeck()
    } else {
      this.props.loadFlashDeck(this.props.flashDeckId, this.props.mode)
    }
  }
  editFlashDeck(id){
    this.props.loadFlashDeck(id, 'EDIT')
  }
  render() {
    let renderable = <></>
    if (this.props.flashDeck && this.props.flashDeck.mode == 'EDIT') {
      renderable = <FlashCardEditor flashDeck={this.props.flashDeck} />
    } else if (this.props.flashDeck && this.props.flashDeck.mode == 'TEST' /*&& !this.props.flashDeck.hasOwnProperty('currentIndex')*/) {
      renderable = <FlashDeckTest flashDeck={this.props.flashDeck} onEditButtonPress={this.editFlashDeck}/>
    } else if (this.props.flashDeck) {
      renderable = <FlashDeckEditor flashDeck={this.props.flashDeck} />
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