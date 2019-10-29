import React from 'react';
import { Button, Grid, GridList, Container } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IntegratedInput from '../widgets/IntegratedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withTheme } from '@material-ui/styles';
//https://react-icons.netlify.com/#/icons/md
import { MdDelete, MdModeEdit } from 'react-icons/md';
//https://react-icons.netlify.com/#/icons/gi
import { GiSwordman, GiHoodedFigure, GiBrutalHelm } from 'react-icons/gi';
import Paper from 'material-ui/Paper';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';


const styles = theme => ({
    paper: {
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
const randomProfiles = [
    'https://upload.wikimedia.org/wikipedia/commons/f/f1/Sophia_Loren_1962.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1b/LuckyLucianoSmaller.jpeg',
    'https://i.ebayimg.com/images/g/NIAAAOSwAaJaQuGk/s-l300.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Carlo_Gambino.jpg/1280px-Carlo_Gambino.jpg',
    'https://www.onthisday.com/images/people/bugsy-siegel-medium.jpg',
    'https://themobmuseum.org/wp-content/uploads/2016/03/3-21-16-Virginia-Hill.jpg',

]

class FlashGangMemberListItemStyled extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editing: false, rank: 'MEMBER' }
    }
    render() {
        var editLevel = 2;
        if (this.props.flashGang) {
            if (this.props.flashGang.rank == 'LIEUTENANT') {
                editLevel = 1;
            } else if (this.props.flashGang.rank == 'BOSS') {
                editLevel = 0;
            }
        }
        this.props.gangMember.profileImage = this.props.gangMember.profileImage ? this.props.gangMember.profileImage : randomProfiles[Math.floor(Math.random() * Math.floor(randomProfiles.length))]
        return (
            <Grid container spacing={0} style={{ paddingTop: '4px' }}>

                <Grid item xs={2} sm={1} md={1} style={this.props.theme.actionListItem}>
                    <div style={{
                        position: 'relative',
                        top: 0, left: 0,
                        display: editLevel < 2 && this.props.gangMember.rank != 'BOSS' ? '' : 'none', zIndex: 99,
                        bottomMargin: '18px'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            ...this.props.theme.systemButton
                        }}>
                            <MdModeEdit
                                onClick={
                                    () => {
                                        this.setState({ editing: !this.state.editing })
                                    }
                                }
                            />
                            <MdDelete
                                style={{ display: this.state.editing ? '' : 'none' }}
                                onClick={
                                    () => {
                                        this.setState({ editing: false })
                                        this.props.onDelete()
                                    }
                                }
                            />

                        </div>
                    </div>
                    <Container style={{
                        height: '100%',
                        backgroundImage: `url('${this.props.gangMember.profileImage}')`,
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat'
                    }}
                        height={'10%'}>
                    </Container>
                </Grid>
                <Grid item xs={8} sm={9} md={9} style={this.props.theme.actionListItem}>
                    <Container height={'10%'} style={{ verticalAlign: 'middle' }}>

                        <div
                            style={{
                                display: !this.state.editing ? '' : 'none',
                                verticalAlign: 'baseline',
                                paddingTop: '16px'
                            }}
                        >
                            {
                                !this.props.gangMember.firstName && !this.props.gangMember.lastName ?
                                    this.props.gangMember.id :
                                    this.props.gangMember.firstName ? this.props.gangMember.firstName : '' +
                                        this.props.gangMember.lastName ? this.props.gangMember.lastName : ''
                            }
                        </div>

                        <div
                            style={{
                                display: this.state.editing ? '' : 'none',
                                verticalAlign: 'middle'
                            }}
                        >
                            <IntegratedInput
                                id='id'
                                placeholder='Gang member email'
                                onChange={
                                    (event) => { this.props.gangMember.id = event.target.value }
                                }
                                ref={
                                    input => input ? input.reset(this.props.gangMember.id) : true
                                }
                            />
                        </div>
                    </Container>
                </Grid>
                <Grid item xs={2} sm={2} md={2} style={this.props.theme.actionListItem}>
                    <Container style={{ height: 60 }}>
                        <div
                            style={{
                                display: !this.state.editing ? 'block' : 'none',
                                paddingTop: '16px'
                            }}
                        >
                            {
                                this.props.gangMember.rank == 'BOSS' &&
                                <GiBrutalHelm style={this.props.theme.icon} />
                            }
                            {
                                this.props.gangMember.rank == 'LIEUTENANT' &&
                                <GiSwordman style={this.props.theme.icon} />
                            }
                            {
                                this.props.gangMember.rank == 'MEMBER' &&
                                <GiHoodedFigure style={this.props.theme.icon} />
                            }
                        </div>

                        <div
                            style={{
                                display:
                                    this.state.editing &&
                                        editLevel < 2 &&
                                        (this.props.gangMember.rank != 'BOSS' || this.props.flashGang.rank == 'BOSS')
                                        ? 'block' : 'none',
                                paddingTop: '8px'
                            }}
                        >
                            <Select
                                value={this.props.gangMember.rank}
                                onChange={
                                    (event) => {
                                        this.props.gangMember.rank = event.target.value;
                                        this.forceUpdate()
                                    }
                                }
                            >
                                {editLevel < 1 &&
                                    <MenuItem value={'BOSS'}>
                                        <GiBrutalHelm style={this.props.theme.icon} />
                                    </MenuItem>
                                }
                                {editLevel < 2 &&
                                    <MenuItem value={'LIEUTENANT'}>
                                        <GiSwordman style={this.props.theme.icon} />
                                    </MenuItem>
                                }
                                <MenuItem value={'MEMBER'}>
                                    <GiHoodedFigure style={this.props.theme.icon} />
                                </MenuItem>
                            </Select>

                        </div>
                    </Container>
                </Grid>
            </Grid>
        )
    }
}
class FlashDeckListItemStyled extends React.Component {

    render() {
        return (
            <Grid container spacing={0} style={{ paddingTop: '4px' }}>
                <FlashListItem alignItems="flex-start"
                    buttonType='action'
                    button
                    style={{ paddingTop: '4px' }}
                >
                    <ListItemAvatar>
                        <Icon style={{ fontSize: 30 }}>{this.props.flashDeck.icon}</Icon>
                    </ListItemAvatar>
                    <ListItemText
                        primary={this.props.flashDeck.name}
                        secondary={this.props.flashDeck.description}
                        onClick={this.props.onClick}
                    />
                </FlashListItem>
            </Grid>
        )
    }
}
const FlashGangMemberListItem = withTheme(FlashGangMemberListItemStyled);
const FlashDeckListItem = withTheme(FlashDeckListItemStyled);
export {
    FlashGangMemberListItem,
    FlashDeckListItem
}