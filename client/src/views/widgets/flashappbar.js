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
import Avatar from '@material-ui/core/Avatar';

const someImages = require('../../utility/smimages')

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
  listItem = (action, image, primary, secondary) => {
    return (
      <FlashListItem alignItems="flex-start"
        onClick={action}
        button
      >
        <Avatar
          src={image}
          style={{borderRadius: '50%'}}/>
        <ListItemText
          primary={primary}
          secondary={secondary}
        />
      </FlashListItem>
    )
  }
  render() {
    let renderable = <>
      {this.props.goSettings &&
        this.listItem(this.props.goSettings,
          this.props.user && this.props.user.picture ? this.props.user.picture : someImages.getRandomGangsterImage(),
          "Settings",
          "Click here to go to settings"
        )
      }
      {this.props.onLogOut &&
        this.listItem(this.props.onLogOut,
          '/exit.jpg',
          "Log out",
          "Click here to log out"
        )
      }
      {this.props.goHome &&
        this.listItem(this.props.goHome,
          someImages.getRandomSubjectImage(),
          "Flash decks",
          "Click here to go home"
        )
      }
      {this.props.goGangs &&
        this.listItem(this.props.goGangs,
          someImages.getRandomGangImage(),
          "Flash gangs",
          "Click here to go see your gangs"
        )
      }
    </>
    return (
      <div style={{
        marginBottom: '48px'
      }}>
        <AppBar position="fixed" style={{
        }}>
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