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

class FlashGangs extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.loadGangs()
  }
  render() {
    const flashGangs=this.props.flashGangs;
    const generateFlashGangList = () => {
      if (!flashGangs){
        return (
          <></>
        )
      }
      var _display = flashGangs.map((flashGang, i) => {
        if (!flashGang.icon) {
            flashGang.icon=someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
        }
        return (
          <>
          <ListItem alignItems="flex-start"
            button
            onClick={()=>
              this.props.onFlashGangSelected(flashGang.id, 'GANG')
            }>
            <ListItemAvatar>
              <Icon style={{fontSize:30}}>{flashGang.icon}</Icon>
            </ListItemAvatar>
            <ListItemText
              primary={flashGang.name}
              secondary={flashGang.description}
              />
          </ListItem>
          { i<flashGangs.length-1 &&
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
      <FlashAppBar title='FlashGang!' station='GANGS' goHome={this.props.goHome}/>
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
              secondary="Click here to create a new FlashGang"
              onClick={this.props.createFlashGang}
              />
          </FlashListItem>
          {generateFlashGangList()}
        </List>
      </>
    )
  }
}
function mapStateToProps(state, props) {
  console.log('state', state)
  return { flashGangs: state.flashGangs }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashGangs)