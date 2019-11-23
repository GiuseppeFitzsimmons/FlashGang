import React from 'react';
//import logo from '../logo.svg';
import '../App.css';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import { Button, Grid, GridList } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { FlashListItem, FlashButton } from './widgets/FlashBits'
import FlashAppBar from './widgets/flashappbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Upgrade from './components/upgrade';

const someIcons = ['language', 'timeline', 'toc', 'palette', 'all_inclusive', 'public', 'poll', 'share', 'emoji_symbols']
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class FlashGangs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { RSVPDialogOpen: false, flashGang: {} }
  }
  componentDidMount() {
    this.props.loadGangs()
  }
  openModal(flashGang) {
    this.setState({ RSVPDialogOpen: true, flashGang: flashGang })
  }
  RSVPAnswer(acceptance) {
    if (acceptance) {
      this.state.flashGang.state = 'ACCEPTED'
    } else {
      var i = 0
      for (i in this.props.flashGangs) {
        let gang = this.props.flashGangs[i]
        if (gang.id == this.state.flashGang.id) {
          break
        }
      }
      this.props.flashGangs.splice(i, 1)
    }
    this.props.sendRSVP(this.state.flashGang.id, acceptance)
    this.setState({ RSVPDialogOpen: false })
    if (acceptance) {
      this.props.onFlashGangSelected(this.state.flashGang.id)
    }
  }
  render() {
    const flashGangs = this.props.flashGangs;
    const generateFlashGangList = () => {
      if (!flashGangs) {
        return (
          <></>
        )
      }
      var _display = flashGangs.map((flashGang, i) => {
        console.log('flashGang', flashGang)
        if (!flashGang.icon) {
          flashGang.icon = someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
        }
        return (
          <>
            {this.renderRSVPdialog()}
            <ListItem alignItems="flex-start"
              button
              onClick={() => {
                if (flashGang.state == 'TO_INVITE' || flashGang.state == 'INVITED') {
                  this.openModal(flashGang)
                } else {
                  this.props.onFlashGangSelected(flashGang.id)
                }
              }
              }>
              <ListItemAvatar>
                <Icon style={{ fontSize: 30 }}>{flashGang.icon}</Icon>
              </ListItemAvatar>
              <ListItemText
                primary={flashGang.name}
                secondary={flashGang.state == 'TO_INVITE' || flashGang.state == 'INVITED' ? flashGang.state: flashGang.description}
              />
            </ListItem>
            {i < flashGangs.length - 1 &&
              <Divider variant="inset" component="li" />
            }
          </>
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
        <FlashAppBar title='FlashGang!' station='GANGS' goHome={this.props.goHome} onLogOut={this.props.onLogOut} goSettings={this.props.goSettings}/>
        <List>
          <FlashListItem alignItems="flex-start"
            onClick={this.props.onNewButton}
            buttonType='action'
            button
          >
            <ListItemAvatar>
              <Icon style={{ fontSize: 30 }}>add_circle</Icon>
            </ListItemAvatar>
            <ListItemText
              primary="New"
              secondary="Click here to create a new FlashGang"
              onClick={
                () => {
                  if (this.props.user.remainingFlashGangsAllowed > 0) {
                    this.props.createFlashGang()
                  } else {
                    this.upgrade.open('GANGS')
                  }
                }}
            />
          </FlashListItem>
          {generateFlashGangList()}
        </List>
        <Upgrade
          parent={this}
        >
        </Upgrade>
      </>
    )
  }
  renderRSVPdialog() {
    var message = <>You have been invited to join <b>{this.state.flashGang.name}</b> <i>({this.state.flashGang.description})</i>. Would you like to accept?</>;
    if (this.state.flashGang.invitedBy) {
      var invitor = this.state.flashGang.invitedBy.id;
      if (this.state.flashGang.invitedBy.firstName || this.state.flashGang.invitedBy.lastName) {
        invitor = (this.state.flashGang.invitedBy.firstName ? this.state.flashGang.invitedBy.firstName + ' ' : '') +
          (this.state.flashGang.invitedBy.lastName ? this.state.flashGang.invitedBy.lastName : '')
      }
      message = <>You have been invited to join <b>{this.state.flashGang.name}</b> by {invitor}. Would you like to accept?</>;
    }
    return (
      <Dialog
        open={this.state.RSVPDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{this.state.flashGang.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FlashButton onClick={() => { this.RSVPAnswer(false) }} color="primary" buttonType='system'>
            Disagree
          </FlashButton>
          <FlashButton onClick={() => { this.RSVPAnswer(true) }} color="primary" buttonType='system'>
            Agree
          </FlashButton>
        </DialogActions>
      </Dialog>
    )
  }
}
function mapStateToProps(state, props) {
  console.log('state', state)
  return { flashGangs: state.flashGangs, user: state.user }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashGangs)