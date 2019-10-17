import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { FlashListItem } from './FlashBits';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import ListItemText from '@material-ui/core/ListItemText';

export default class FlashAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openDrawer: false }
  }
  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({ ...this.state, openDrawer: open });
  };
  render() {
    let renderable = <>
      <FlashListItem alignItems="flex-start"
        onClick={this.props.onNewButton}
        button
      >
        <ListItemAvatar>
          <Icon style={{ fontSize: 30 }}>add_circle</Icon>
        </ListItemAvatar>
        <ListItemText
          primary="Settings"
          secondary="Click here to go to settings"
        />
      </FlashListItem>
      <FlashListItem alignItems="flex-start"
        onClick={this.props.onNewButton}
        button
      >
        <ListItemAvatar>
          <Icon style={{ fontSize: 30 }}>add_circle</Icon>
        </ListItemAvatar>
        <ListItemText
          primary="Log out"
          secondary="Click here to log out"
        />
      </FlashListItem>
      {(this.props.station == 'DECK' || this.props.station == 'GANGS') &&
        <FlashListItem alignItems="flex-start"
          onClick={this.props.goHome}
          button
        >
        <ListItemAvatar>
          <Icon style={{ fontSize: 30 }}>home</Icon>
        </ListItemAvatar>
        <ListItemText
          primary="Flash decks"
          secondary="Click here to go home"
        />
      </FlashListItem>
      }
      {(this.props.station == 'DECK' || this.props.station == 'HOME') &&
        <FlashListItem alignItems="flex-start"
        onClick={this.props.goGangs}
        button
      >
        <ListItemAvatar>
          <Icon style={{ fontSize: 30 }}>home</Icon>
        </ListItemAvatar>
        <ListItemText
          primary="Flash gangs"
          secondary="Click here to go see your gangs"
        />
      </FlashListItem>
      }
    </>
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => { this.setState({ openDrawer: true }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {this.props.title ? this.props.title : 'FlashGang'}
            </Typography>
            <IconButton aria-label="show 17 new notifications" color="inherit">
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.openDrawer} onClose={this.toggleDrawer(false)}>
          <List>
            {renderable}
          </List>
        </Drawer>
      </div>
    );
  }
}