import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import {
  Button,
  Col,
  Input
} from "reactstrap";

class FlashDeckEditor extends React.Component {
    render() {
        const flashDeck = this.props.flashDeck
      return (
        <>
        <Col>
          <IntegratedInput
            label="FlashDeck Name"
            value={flashDeck.name}
            id='flashCardName'
            placeholder='flash card name'
            onChange={
                (event) => { flashDeck.name = event.target.value }
            }
          />
        </Col>
        <Col>
          <IntegratedInput
            label="Description"
            defaultValue={flashDeck.decription}
            id='flashCardDescription'
            placeholder='flash card description'
            onChange={
                (event) => { flashDeck.description = event.target.value }
            }
          />
          </Col>
        <Col>
          <IntegratedInput
            label="Fuzziness"
            type='number'
            id='flashCardFuzziness'
            placeholder='flash card fuzziness'
            onChange={
                (event) => { flashDeck.fuzziness = event.target.value }
            }
          />
          </Col>
        <Col>
          <AwesomeButton
            onPress = {() => this.props.nextCard(flashDeck)}
          >
              Edit Cards
          </AwesomeButton>
          </Col>
        <Col>
          <AwesomeButton
                    onPress={() => {
                        this.props.saveDeck(this.props.flashDeck)
                    }

                    }
                >
                    Save Deck
            </AwesomeButton>
          </Col>
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