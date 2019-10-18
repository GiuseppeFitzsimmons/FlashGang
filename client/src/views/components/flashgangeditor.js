import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FlashAppBar from '../widgets/flashappbar'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import { MdDelete } from 'react-icons/md'
import DeckSelector from '../widgets/deckselector';

const someIcons = ['language', 'timeline', 'toc', 'palette', 'all_inclusive', 'public', 'poll', 'share', 'emoji_symbols']

class FlashGangEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            memberTab: 'block',
            deckTab: 'none'
        }
        this.invite = this.invite.bind(this)
        this.onDecksSelected = this.onDecksSelected.bind(this)
    }
    componentDidMount() {
        console.log('this.props',this.props)
        if (!this.props.flashGangId) {
            this.props.newGang()
        } else {
            this.props.loadFlashGang(this.props.flashGangId)
        }
    }
    componentDidUpdate() {
        console.log('props', this.props)
    }
    onDecksSelected() {
        this.forceUpdate()
    }
    invite() {
        if (!this.props.flashGang.members) {
            this.props.flashGang.members = []
        }
        this.props.flashGang.members.push({
            email: '',
            rank: 'MEMBER'
        })
        this.forceUpdate()
    }
    removeMember(index) {
        this.props.flashGang.members.splice(index, 1)
        this.forceUpdate()
    }
    render() {
        const flashGang = this.props.flashGang ? this.props.flashGang : {}
        return (
            <div>
                <FlashAppBar title='FlashGang!' station='GANGS' goHome={this.props.goHome} />
                <IntegratedInput
                    label="Gang Name"
                    id='gangName'
                    placeholder='Your gang name'
                    onChange={
                        (event) => { flashGang.name = event.target.value }
                    }
                    ref={
                        input => input ? input.reset(flashGang.name) : true
                    }
                />
                <IntegratedInput
                    label="Gang Description"
                    id='gangDescription'
                    placeholder='Your gang description'
                    onChange={
                        (event) => { flashGang.description = event.target.value }
                    }
                    ref={
                        input => input ? input.reset(flashGang.description) : true
                    }
                />
                <Tabs aria-label="simple tabs example" onChange={(e, value) => {
                    console.log('VALUE', value)
                    this.setState({
                        memberTab: value == 0 ? 'block' : 'none',
                        deckTab: value == 1 ? 'block' : 'none'
                    })
                }}>
                    <Tab label="Gang members" style={{backgroundColor: this.state.memberTab=='block' ? 'rgba(255,255,255,0.4)': 'rgba(0,0,0,0.0)'}}/>
                    <Tab label="Gang decks" style={{backgroundColor: this.state.deckTab=='block' ? 'rgba(255,255,255,0.4)': 'rgba(0,0,0,0.0)'}}/>
                </Tabs>

                <div
                    style={{
                        display: this.state.memberTab,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        padding: '2px'
                    }}
                >
                    <List>
                        <FlashListItem alignItems="flex-start"
                            onClick={this.invite}
                            buttonType='action'
                            button
                        >
                            <ListItemAvatar>
                                <Icon style={{ fontSize: 30 }}>add_circle</Icon>
                            </ListItemAvatar>
                            <ListItemText
                                primary="New"
                                secondary="Click here to invite a gang member"
                            />
                        </FlashListItem>
                        {this.generateFlashGangMemberList()}
                    </List>
                </div>
                <div
                    style={{
                        display: this.state.deckTab,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        padding: '2px'
                    }}
                >
                    <List>
                        <DeckSelector
                            onClose={this.onDecksSelected}
                            flashGang={flashGang}
                        />
                        {this.generateFlashDeckList()}
                    </List>
                </div>
                <FlashButton
                    buttonType='system'
                    onClick={() => { this.props.saveGang(flashGang) }}
                >
                    Save
                </FlashButton>
            </div>
        )
    }
    generateFlashGangMemberList = () => {
        const flashGang = this.props.flashGang ? this.props.flashGang : {}
        if (!flashGang.members) {
            return (
                <></>
            )
        }
        var _display = flashGang.members.map((member, i) => {
            if (!member.icon) {
                member.icon = someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
            }
            return (
                <>
                    <Grid>
                        <ListItem alignItems="flex-start"
                            button>
                            <ListItemAvatar>
                                <Icon style={{ fontSize: 30 }}>{member.icon}</Icon>
                            </ListItemAvatar>
                            <ListItemText
                                primary={member.name}
                                secondary={member.rank}
                            />
                        </ListItem>
                        <IntegratedInput
                            label="Email"
                            id='memberEmail'
                            placeholder='Gang member email'
                            onChange={
                                (event) => { member.email = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(member.email) : true
                            }
                        />
                        <MdDelete
                            onClick={
                                () => {
                                    this.removeMember(i)
                                }
                            }
                        />
                    </Grid>
                    {i < flashGang.members.length - 1 &&
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
    generateFlashDeckList() {
        const flashDecks = this.props.flashGang && this.props.flashGang.flashDecks ? this.props.flashGang.flashDecks : []
        var _display = flashDecks.map((flashDeck, i) => {
            if (!flashDeck.icon) {
                flashDeck.icon = someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
            }
            return (
                <>
                    <Grid>
                        <ListItem alignItems="flex-start"
                            button>
                            <ListItemAvatar>
                                <Icon style={{ fontSize: 30 }}>{flashDeck.icon}</Icon>
                            </ListItemAvatar>
                            <ListItemText
                                primary={flashDeck.name}
                                secondary={flashDeck.description}
                            />
                        </ListItem>
                    </Grid>
                    {i < flashDecks.length - 1 &&
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
}





function mapStateToProps(state, props) {
    console.log("mapStateToProps", state);
    return {
        flashGang: state.flashGang
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashGangEditor)