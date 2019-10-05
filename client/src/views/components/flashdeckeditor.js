import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class FlashDeckEditor extends React.Component {
    render() {
      return (
        <>
          <input
            id='flashCardName'
            placeholder='flash card name'
          />
          <input
            id='flashCardDescription'
            placeholder='flash card description'
          />
          <input
            type='number'
            id='flashCardFuzziness'
            placeholder='flash card fuzziness'
          />
          <AwesomeButton
            onPress = {() => this.props.nextCard(this.props.flashDeck)}
          >
              Edit Cards
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
  
export default connect(mapStateToProps, mapDispatchToProps)(FlashDeckEditor)