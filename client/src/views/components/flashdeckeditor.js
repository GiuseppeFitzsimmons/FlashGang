import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

class FlashDeckEditor extends React.Component {
  render() {
    const flashDeck = this.props.flashDeck
    return (
      <Grid container
          direction="column"
          justify="space-between"
          alignItems="stretch"
          >
          <IntegratedInput
            label="FlashDeck Name"
            id='flashCardName'
            placeholder='flash card name'
            onChange={
              (event) => { flashDeck.name = event.target.value }
            }
            ref={
              input => input ? input.reset(flashDeck.name) : true
            }
          />
          <IntegratedInput
            label="Description"
            id='flashCardDescription'
            placeholder='flash card description'
            onChange={
              (event) => { flashDeck.description = event.target.value }
            }
            ref={
              input => input ? input.reset(flashDeck.description) : true
            }
          />
          <IntegratedInput
            label="Fuzziness"
            type='number'
            id='flashCardFuzziness'
            placeholder='flash card fuzziness'
            onChange={
              (event) => { flashDeck.fuzziness = event.target.value }
            }
            ref={
              input => input ? input.reset(flashDeck.fuzziness) : true
            }
          />
          <Button
            color='primary'
            variant='contained'
            onClick={
              () => this.props.nextCard(flashDeck)
            }
          >
            Edit Cards
          </Button>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              this.props.saveDeck(this.props.flashDeck)
            }}
          >
            Save Deck
          </Button>
      </Grid>
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