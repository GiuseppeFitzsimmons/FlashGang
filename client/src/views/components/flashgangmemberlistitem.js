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
import { GiSwordman, GiHoodedFigure, GiBrutalHelm, GiImperialCrown, GiFedora, GiCaptainHatProfile, GiFloorHatch } from 'react-icons/gi';
import Paper from 'material-ui/Paper';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Popover from '@material-ui/core/Popover';


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
        this.state = { editing: false, rank: 'MEMBER', editingRank: false }
    }
    render() {
        var editLevel = 2;
        if (this.props.flashGang) {
            if (this.props.flashGang.rank == 'LIEUTENANT') {
                editLevel = 1;
            } else if (this.props.flashGang.rank == 'BOSS') {
                editLevel = 0;
            } else if (this.props.user.id == this.props.flashGang.owner){
                editLevel = 0;
            }
        }
        this.props.gangMember.picture = this.props.gangMember.picture ? this.props.gangMember.picture : randomProfiles[Math.floor(Math.random() * Math.floor(randomProfiles.length))]
        var name = this.props.gangMember.firstName;
        if (name) {
            if (this.props.gangMember.lastName) {
                name+=' '+this.props.gangMember.lastName;
            }
        } else {
            name=this.props.gangMember.lastName;
        }
        if (!name) {
            name=this.props.gangMember.id;
        }
        return (
            <Grid container spacing={0} style={{ paddingTop: '4px', height: '15%' }}>

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

                        </div>
                    </div>
                    <Container style={{
                        height: '100%',
                        backgroundImage: `url('${this.props.gangMember.picture}')`,
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat'
                    }}
                        height={'20%'}>
                    </Container>
                </Grid>
                <Grid item xs={10} sm={11} md={11} style={this.props.theme.actionListItem}>
                    <div style={{
                        position: 'relative',
                        top: 0, right: '0',
                        display: this.state.editing ? '' : 'none', zIndex: 99,
                        bottomMargin: '18px'
                    }}>
                        <div
                            id='rankEditorIcon'
                            style={{
                                position: 'absolute',
                                top: 0, right: '28px',
                                paddingLeft:'2px',
                                paddingRight:'2px',
                                ...this.props.theme.systemButton
                            }}>
                                {
                                    this.props.gangMember.rank == 'BOSS' &&
                                    <GiImperialCrown
                                        onClick={
                                            (event) => {
                                                this.setState({ editingRank: !this.state.editingRank, anchorRankIcon: event.currentTarget })
                                            }
                                        }
                                    />
                                }
                                {
                                    this.props.gangMember.rank == 'LIEUTENANT' &&
                                    <GiFedora
                                        onClick={
                                            (event) => {
                                                this.setState({ editingRank: !this.state.editingRank, anchorRankIcon: event.currentTarget })
                                            }
                                        }
                                    />
                                }
                                {
                                    this.props.gangMember.rank == 'MEMBER' &&
                                    <GiCaptainHatProfile
                                        onClick={
                                            (event) => {
                                                this.setState({ editingRank: !this.state.editingRank, anchorRankIcon: event.currentTarget })
                                            }
                                        }
                                    />
                                }

                        </div>
                        
                        <div
                            id='rankEditorIcon'
                            style={{
                                position: 'absolute',
                                top: 0, right: 0,
                                paddingLeft:'2px',
                                paddingRight:'2px',
                                ...this.props.theme.systemButton
                            }}>
                            <GiFloorHatch
                                style={{ display: this.state.editing ? '' : 'none', }}
                                onClick={
                                    () => {
                                        this.setState({ editing: false })
                                        this.props.onDelete()
                                    }
                                }
                            />

                        </div>
                    </div>
                    <Container height={'20%'} style={{ verticalAlign: 'middle' }}>

                        <div
                            style={{
                                display: !this.state.editing ? '' : 'none',
                                verticalAlign: 'baseline',
                                paddingTop: '16px'
                            }}
                        >
                            {name}
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
                        <Popover
                            id='rankEditorIcon'
                            open={this.state.editingRank}
                            anchorEl={this.state.anchorRankIcon}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >

                            <Select
                                value={this.props.gangMember.rank}
                                onChange={
                                    (event) => {
                                        this.props.gangMember.rank = event.target.value;
                                        this.setState({editingRank:false})
                                        // this.forceUpdate()
                                    }
                                }
                            >
                                {editLevel < 1 &&
                                    <MenuItem value={'BOSS'}>BOSS</MenuItem>
                                }
                                {editLevel < 2 &&
                                    <MenuItem value={'LIEUTENANT'}>LIEUTENANT</MenuItem>
                                }
                                <MenuItem value={'MEMBER'}>MEMBER</MenuItem>
                            </Select>

                        </Popover>
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
                    buttonType={this.props.buttonType ? this.props.buttonType : 'action'}
                    button
                    style={{ ...this.props.style }}
                >
                    <ListItemAvatar
                    >
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