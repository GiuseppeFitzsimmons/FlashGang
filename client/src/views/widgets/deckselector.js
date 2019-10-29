import React from 'react';
import { FlashButton } from './FlashBits'
import Icon from '@material-ui/core/Icon';
import { withTheme } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { FlashListItem } from './FlashBits'
import { FlashDeckListItem } from '../components/flashgangmemberlistitem';


class DeckSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, icon: 'add_circle' }
    this.handleClose = this.handleClose.bind(this);
    this.handleEntering = this.handleEntering.bind(this);
  }
  handleEntering() {

  }
  handleClose() {
    this.setState({ open: false })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }
  componentDidMount() {
    this.props.loadDecks()
  }
  putDeck(flashDeck) {
    if (this.props.flashGang) {
      if (!this.props.flashGang.flashDecks) {
        this.props.flashGang.flashDecks = []
      }
      let foundDeck = this.props.flashGang.flashDecks.filter(deck => deck.id == flashDeck.id)
      if (foundDeck.length) {
        this.props.flashGang.flashDecks = this.props.flashGang.flashDecks.filter(deck => deck.id != flashDeck.id)
      } else {
        this.props.flashGang.flashDecks.push(flashDeck)
      }
    }
    this.forceUpdate()
  }
  render() {
    const generateFlashDeckList = () => {
      if (!this.props.flashDecks) {
        return (
          <></>
        )
      }
      var _display = this.props.flashDecks.map((flashDeck, i) => {
        let deckInGang = false
        if (this.props.flashGang.flashDecks) {
          deckInGang = this.props.flashGang.flashDecks && this.props.flashGang.flashDecks.filter(deck => deck.id == flashDeck.id)
          deckInGang = deckInGang.length > 0
        }
        return (
          <FlashDeckListItem flashDeck={flashDeck}
            buttonType={deckInGang ? 'system':'action'}
            onClick={() =>
              this.putDeck(flashDeck)
            } />
        )
      })
      return (
        <>
          {_display}
        </>
      )
    }
    return (
      <>
        <FlashListItem alignItems="flex-start"
          onClick={
            () => this.setState({ open: true })
          }
          buttonType='action'
          button
        >
          <ListItemAvatar>
            <Icon style={{ fontSize: 30 }}>add_circle</Icon>
          </ListItemAvatar>
          <ListItemText
            primary="Select FlashDecks"
            secondary="Click here to manage your gang's FlashDecks"
          />
        </FlashListItem>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          fullWidth={true}
          maxWidth='lg'
          onEntering={this.handleEntering}
          aria-labelledby="confirmation-dialog-title"
          open={this.state.open}
        >
          <DialogTitle id="confirmation-dialog-title">Select Decks</DialogTitle>

          <DialogContent dividers>
            {generateFlashDeckList()}
          </DialogContent>

          <DialogActions>
            <FlashButton onClick={this.handleClose} color="primary" buttonType='system'>
              Close
              </FlashButton>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}
function mapStateToProps(state, props) {
  return {
    flashDecks: state.flashDecks
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckSelector)