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
import { FlashTypography } from '../widgets/FlashBits';
import Slider from '@material-ui/core/Slider';

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
];
function valuetext(value) {
  return `${value}`;
}
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
            <IconSelector icon={flashDeck.icon} iconClient={flashDeck} />
          </Grid>
          <Grid item xs='10'>
            <IntegratedInput
              label="FlashDeck Name"
              id='flashCardName'
              placeholder='flash card name'
              onChange={
                (event) => { flashDeck.name = event.target.value; flashDeck.dirty = true; this.forceUpdate() }
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
            (event) => { flashDeck.description = event.target.value; flashDeck.dirty = true; this.forceUpdate() }
          }
          ref={
            input => input ? input.reset(flashDeck.description) : true
          }
        />
        <label style={{ color: 'rgba(0,0,0,0.6)', marginTop:'18px' }}>Fuzziness</label>
        <Slider
          defaultValue={flashDeck.fuzziness ? flashDeck.fuzziness : 0}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={10}
          onChange={
            (event, newValue) => { flashDeck.fuzziness = newValue; flashDeck.dirty = true; this.forceUpdate(); }
          }
        />
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='action'
          icon='filter'
          disabled={!flashDeck.name || flashDeck.name == ''}
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
          icon={!flashDeck.dirty || !flashDeck.name || flashDeck.name == '' ? 'lens' : 'blur_on'}
          disabled={!flashDeck.dirty || !flashDeck.name || flashDeck.name == ''}
          onClick={() => {
            this.props.saveDeck(this.props.flashDeck)
          }}

        >
          Save Deck
          </FlashButton>
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='system'
          icon='delete'
          onClick={() => {
            this.props.deleteDeck(this.props.flashDeck.id)
          }}
        >
          Delete Deck
          </FlashButton>
        <FlashButton
          color='primary'
          variant='contained'
          buttonType='system'
          icon='home'
          onClick={this.props.goHome}
        >
          Home
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