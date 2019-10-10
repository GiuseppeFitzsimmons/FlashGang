import React from 'react';
//import logo from './logo.svg';
import '../App.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import FlashDeckEditor from './components/flashdeckeditor'
import FlashCardEditor from './components/flashcardeditor'
import FlashDeckTest from './components/flashdecktest';
import FlashTestSingleAnswer from './components/flashtestsingleanswer';
import FlashTestMultipleAnswer from './components/flashtestmultipleanswer';
import FlashCardScore from './components/flashcardscore';
import FlashDeckScore from './components/flashdeckscore';

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
  editFlashDeck(id) {
    this.props.loadFlashDeck(id, 'EDIT')
  }
  render() {
    let renderable = <></>
    console.log('this.props.flashDeck', this.props.flashDeck)
    if (this.props.flashDeck && this.props.flashDeck.mode === 'COMPLETE') {
      renderable = <FlashDeckScore flashDeck={this.props.flashDeck}/>
    } else if (this.props.flashDeck && this.props.flashDeck.mode === 'EDIT' && this.props.flashDeck.hasOwnProperty('currentIndex')) {
      renderable = <FlashCardEditor flashDeck={this.props.flashDeck} />
    } else if (this.props.flashDeck && this.props.flashDeck.mode === 'EDIT') {
      renderable = <FlashDeckEditor flashDeck={this.props.flashDeck} />
    } else if (this.props.flashDeck && this.props.flashDeck.hasOwnProperty('currentIndex') && this.props.flashDeck.mode == 'TEST') {
      if (this.props.flashDeck.answerType == 'SINGLE'){
        renderable = <FlashTestSingleAnswer flashDeck={this.props.flashDeck} onNextCard={this.props.scoreCard} />
      } else {
        renderable = <FlashTestMultipleAnswer flashDeck={this.props.flashDeck} onNextCard={this.props.scoreCard} />
      }
      if (this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].hasOwnProperty('correct')) {
        if (this.props.flashDeck.testType === 'REVISION') {
          renderable = <FlashCardScore flashDeck={this.props.flashDeck} onNextCard={this.props.nextCard} />
        } 
      }
    } else if (this.props.flashDeck && this.props.flashDeck.mode == 'TEST') {
      renderable = <FlashDeckTest flashDeck={this.props.flashDeck} onEditButtonPress={this.editFlashDeck}/>
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