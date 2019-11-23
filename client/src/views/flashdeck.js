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
import FlashAppBar from './widgets/flashappbar'

class FlashDeck extends React.Component {
  constructor(props) {
    super(props)
    this.editFlashDeck = this.editFlashDeck.bind(this)
  }
  componentDidMount() {
    if (!this.props.flashDeckId) {
      this.props.newDeck()
    } else {
      this.props.loadFlashDeck(this.props.flashDeckId, this.props.mode, null, null, this.props.source)
    }
  }
  editFlashDeck(id) {
    this.props.loadFlashDeck(id, 'EDIT')
  }
  render() {
    let renderable = <></>
    if (this.props.flashDeck && this.props.flashDeck.mode === 'COMPLETE') {
      renderable = <FlashDeckScore 
        flashDeck={this.props.flashDeck} 
        onStartOver={()=>{this.props.loadFlashDeck(this.props.flashDeck.id, 'TEST', this.props.flashDeck.answerType, this.props.flashDeck.testType)}}
        goHome = {this.props.goHome}
        />
    } else if (this.props.flashDeck && this.props.flashDeck.mode === 'EDIT' && this.props.flashDeck.hasOwnProperty('currentIndex')) {
      renderable = <FlashCardEditor flashDeck={this.props.flashDeck} goHome = {this.props.goHome} />
    } else if (this.props.flashDeck && this.props.flashDeck.mode === 'EDIT') {
      renderable = <FlashDeckEditor flashDeck={this.props.flashDeck} goHome = {this.props.goHome} />
    } else if (this.props.flashDeck && this.props.flashDeck.hasOwnProperty('currentIndex') && this.props.flashDeck.mode == 'TEST') {
      if (this.props.flashDeck.answerType == 'SINGLE'){
        renderable = <FlashTestSingleAnswer flashDeck={this.props.flashDeck} onNextCard={this.props.scoreCard} />
      } else {
        renderable = <FlashTestMultipleAnswer flashDeck={this.props.flashDeck} onNextCard={this.props.scoreCard} />
      }
      if (this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].hasOwnProperty('correct')) {
        if (this.props.flashDeck.testType === 'REVISION' || this.props.flashDeck.testType === 'CRAM') {
          renderable = <FlashCardScore flashDeck={this.props.flashDeck} onNextCard={this.props.nextCard} />
        } 
      }
    } else if (this.props.flashDeck && this.props.flashDeck.mode == 'TEST') {
      renderable = <FlashDeckTest flashDeck={this.props.flashDeck} onEditButtonPress={this.editFlashDeck}/>
    }
    return (
      <>
        <FlashAppBar title={this.props.flashDeck ? this.props.flashDeck.name: null} station='DECK' goHome = {this.props.goHome} goGangs = {this.props.goGangs} onLogOut = {this.props.onLogOut} goSettings={this.props.goSettings}/>
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