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
import { MdDelete } from 'react-icons/md';
import DeckSelector from '../widgets/deckselector';
import { IconSelector } from '../widgets/iconselector';
import { FlashGangMemberListItem, FlashDeckListItem } from './flashgangmemberlistitem';
import Upgrade from '../components/upgrade';
import Confirmation from '../components/confirmation';

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
        if (!this.props.flashGangId) {
            this.props.newGang()
        } else {
            this.props.loadFlashGang(this.props.flashGangId)
        }
    }
    componentDidUpdate() {
    }
    onDecksSelected() {
        this.forceUpdate()
    }
    invite() {
        if (!this.props.flashGang.members) {
            this.props.flashGang.members = []
        }
        this.props.flashGang.remainingMembersAllowed--
        this.props.flashGang.members.push({
            id: '',
            rank: 'MEMBER',
            state: "TO_INVITE"
        })
        this.forceUpdate()
    }
    removeMember(index) {
        this.props.flashGang.remainingMembersAllowed++
        this.props.flashGang.members.splice(index, 1)
        this.forceUpdate()
    }

    render() {
        const flashGang = this.props.flashGang ? this.props.flashGang : {}
        const isOwner = this.props.user && this.props.user.id == flashGang.owner
        return (
            <>
                <FlashAppBar title='FlashGang!' station='GANGS'
                    goHome={this.props.goHome} onLogOut={this.props.onLogOut} goSettings={this.props.goSettings} />

                <Grid container
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                    style={{
                        height: '100%'
                    }}
                >

                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                        style={{
                            height: '7%'
                        }}>
                        <Grid item md={1} sm={2} xs={3}>
                            <IconSelector icon={flashGang.icon} iconClient={flashGang} />
                        </Grid>
                        <Grid item md={11} sm={10} xs={9}>
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
                        </Grid>
                    </Grid>
                    <Grid item
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                        style={{
                            height: '10%'
                        }}>
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
                    </Grid>
                    <Tabs
                        style={{
                            height: '5%'
                        }}
                        onChange={(e, value) => {
                            this.setState({
                                memberTab: value == 0 ? 'block' : 'none',
                                deckTab: value == 1 ? 'block' : 'none'
                            })
                        }}>
                        <Tab label="Gang members" style={{ backgroundColor: this.state.memberTab == 'block' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.0)' }} />
                        <Tab label="Gang decks" style={{ backgroundColor: this.state.deckTab == 'block' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.0)' }} />
                    </Tabs>

                    <Box
                        style={{
                            display: this.state.memberTab,
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            padding: '2px',
                            height: '55%',
                            overflow: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        <FlashListItem alignItems="flex-start"
                            onClick={
                                () => {
                                    if (this.props.flashGang.remainingMembersAllowed > 0) {
                                        this.invite()
                                    } else {
                                        this.upgrade.open('GANG')
                                    }
                                }}
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
                    </Box>
                    <Box
                        style={{
                            display: this.state.deckTab,
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            padding: '2px',
                            height: '55%',
                            overflow: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        <DeckSelector
                            onClose={this.onDecksSelected}
                            flashGang={flashGang}
                        />
                        {this.generateFlashDeckList()}
                    </Box>
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                        style={{
                            height: '6%'
                        }}
                    >
                        <FlashButton
                            buttonType='system'
                            style={{ width: isOwner ? '48%' : '100%' }}
                            onClick={() => { this.props.saveGang(flashGang) }} >
                            Save
                        </FlashButton>
                        <FlashButton
                            buttonType='system'
                            style={{ width: '48%', display: isOwner ? '' : 'none' }}
                            onClick={() => { this.confirmation.open('GANGS') }} >
                            Delete
                        </FlashButton>
                        <Upgrade
                            parent={this}
                        >
                        </Upgrade>
                        <Confirmation
                            parent={this}
                            onConfirm={() => { this.props.deleteGang(flashGang.id) }}
                        />
                    </Grid>
                </Grid>
            </>
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
                    <FlashGangMemberListItem
                        gangMember={member}
                        flashGang={flashGang}
                        user={this.props.user}
                        onDelete={() => { this.removeMember(i) }}
                    />
                    {/*i < flashGang.members.length - 1 &&
                        <Divider variant="inset" component="li" />
                    */}
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
                <FlashDeckListItem flashDeck={flashDeck}
                    onClick={() =>
                        this.props.onFlashDeckSelected(flashDeck.id, 'TEST', 'GANGS')
                    } />
            )
        })
        return (
            <>
                {_display}
            </>
        )
    }

    generateFlashDeckListX() {
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
    return {
        flashGang: state.flashGang,
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashGangEditor)