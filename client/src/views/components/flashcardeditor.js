import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class FlashCardEditor extends React.Component {
    render() {
      return (
        <>
          <input
            id='flashCardQuestion'
            placeholder='flash card name'
          />
          <input
            id='flashCardAnswer'
            placeholder='flash card description'
          />
          <AwesomeButton
            onPress = {() => this.props.nextCard(this.props.flashDeck)}
          >
              Next Card
          </AwesomeButton>
          <AwesomeButton
            onPress = {() => this.props.saveDeck(this.props.flashDeck)}
          >
              Save Deck
          </AwesomeButton>
        </>
      )
    }
  }

function mapStateToProps(state, props) {
    return {}
  }
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(FlashCardEditor)