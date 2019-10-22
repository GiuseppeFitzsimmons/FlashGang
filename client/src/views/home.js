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
import {FlashListItem} from './widgets/FlashBits'
import FlashAppBar from './widgets/flashappbar'
const someIcons=['language','timeline','toc','palette','all_inclusive','public','poll','share','emoji_symbols']

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.loadDecks()
  }
  render() {
    const flashDecks=this.props.flashDecks;
    const generateFlashDeckList = () => {
      if (!flashDecks){
        return (
          <></>
        )
      }
      var _display = flashDecks.map((flashDeck, i) => {
        if (!flashDeck.icon) {
          flashDeck.icon=someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
        }
        return (
          <>
          <ListItem alignItems="flex-start"
            button
            onClick={()=>
              this.props.onFlashDeckSelected(flashDeck.id, 'TEST')
            }>
            <ListItemAvatar>
              <Icon style={{fontSize:30}}>{flashDeck.icon}</Icon>
            </ListItemAvatar>
            <ListItemText
              primary={flashDeck.name}
              secondary={flashDeck.description}
              />
          </ListItem>
          { i<flashDecks.length-1 &&
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
      <FlashAppBar title='FlashGang!' station='HOME' goGangs = {this.props.goGangs} onLogOut = {this.props.onLogOut}/>
        <List>
        <FlashListItem alignItems="flex-start"
            onClick={this.props.onNewButton}
            buttonType='action'
            button
            >
            <ListItemAvatar>
              <Icon style={{fontSize:30}}>add_circle</Icon>
            </ListItemAvatar>
            <ListItemText
              primary="New"
              secondary="Click here to create a new FlashDeck"
              />
          </FlashListItem>
          {generateFlashDeckList()}
        </List>
      </>
    )
  }
}
function mapStateToProps(state, props) {
  console.log('state', state)
  return { flashDecks: state.flashDecks }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)