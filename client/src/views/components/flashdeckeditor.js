import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import { IconSelector } from '../widgets/iconselector';
import {FlashTypography} from '../widgets/FlashBits';

class FlashDeckEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const flashDeck = this.props.flashDeck
    const theme = this.theme;
    return (
      <Grid container
        direction="column"
        justify="space-between"
        alignItems="stretch"
      >
        <Grid container
          direction="row"
          justify="space-between"
          alignItems="stretch"
        >
          <Grid item xs='1'>
            <IconSelector icon={flashDeck.icon} flashDeck={flashDeck}/>
          </Grid>
          <Grid item xs='10'>
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
          </Grid>
        </Grid>
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
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='action'
          onClick={
            () => this.props.nextCard(flashDeck)
          }
        >
          Edit Cards
          </FlashButton>
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='system'
          onClick={() => {
            this.props.saveDeck(this.props.flashDeck)
          }}
        >
          Save Deck
          </FlashButton>
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