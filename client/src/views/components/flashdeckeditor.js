import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class FlashDeckEditor extends React.Component {
    render() {
        const flashDeck = this.props.flashDeck
      return (
        <>
          <input
            defaultValue={flashDeck.name}
            id='flashCardName'
            placeholder='flash card name'
            onChange={
                (event) => { flashDeck.name = event.target.value }
            }
          />
          <input
            defaultValue={flashDeck.decription}
            id='flashCardDescription'
            placeholder='flash card description'
            onChange={
                (event) => { flashDeck.description = event.target.value }
            }
          />
          
          <input
            type='number'
            id='flashCardFuzziness'
            placeholder='flash card fuzziness'
            onChange={
                (event) => { flashDeck.fuzziness = event.target.value }
            }
          />
          <AwesomeButton
            onPress = {() => this.props.nextCard(flashDeck)}
          >
              Edit Cards
          </AwesomeButton>
          <AwesomeButton
                    onPress={() => {
                        this.props.saveDeck(this.props.flashDeck)
                    }

                    }
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
  
export default connect(mapStateToProps, mapDispatchToProps)(FlashDeckEditor)