import React from 'react';
import { Button, Grid, GridList, Container } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IntegratedInput from '../widgets/IntegratedInput';
import { MdDelete } from 'react-icons/md';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class FlashGangMemberListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editing: false, rank: 'MEMBER' }
    }
    render() {
        return (
            <Grid>
                <ListItem
                    alignItems="flex-start"
                    button

                >
                    <Grid
                        container
                        direction='row'
                        alignItems='flex-top'
                    >
                        <Grid
                            item
                            xs='2'
                        >
                            <ListItemAvatar
                                onClick={() => {
                                    this.setState({ editing: !this.state.editing })
                                }}>
                                <Icon style={{ fontSize: 30 }}>{this.props.gangMember.icon}</Icon>
                            </ListItemAvatar>
                        </Grid>
                        <Grid
                            item
                            xs='10'
                        >
                            <Grid
                                container
                                direction='row'
                                alignItems='flex-end'
                                justify='space-between'
                            >
                                <Grid
                                    item
                                    xs='10'
                                >
                                    <div
                                        onClick={() => {
                                            this.setState({ editing: !this.state.editing })
                                        }}
                                    >
                                        {this.props.gangMember.name+'HELLO MY DUDE'}
                                    </div>
                                </Grid>
                                <Grid
                                    item
                                    xs='2'
                                >
                                    <div
                                        style={{
                                            display: !this.state.editing ? 'block' : 'none'
                                        }}
                                    >
                                        {
                                            this.props.gangMember.rank
                                        }
                                    </div>
                                    <div
                                        style={{
                                            display: this.state.editing ? 'block' : 'none'
                                        }}
                                    >
                                        <Select
                                            value={this.props.gangMember.rank}
                                            onChange={
                                                (event) => {
                                                    this.props.gangMember.rank = event.target.value;
                                                    this.forceUpdate()
                                                    console.log('this.props.gangMember.rank', this.props.gangMember.rank)
                                                }
                                            }
                                            inputProps={{
                                                name: 'age',
                                                id: 'age-simple',
                                            }}
                                        >
                                            <MenuItem value={'BOSS'}>Boss</MenuItem>
                                            <MenuItem value={'LIEUTENANT'}>Lieutenant</MenuItem>
                                            <MenuItem value={'MEMBER'}>Member</MenuItem>
                                        </Select>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid>
                                <div
                                    style={{
                                        display: this.state.editing ? 'block' : 'none'
                                    }}
                                >
                                    <IntegratedInput
                                        label="Email"
                                        id='memberEmail'
                                        placeholder='Gang member email'
                                        onChange={
                                            (event) => { this.props.gangMember.email = event.target.value }
                                        }
                                        ref={
                                            input => input ? input.reset(this.props.gangMember.email) : true
                                        }
                                    />
                                    <MdDelete
                                        onClick={
                                            () => {
                                                this.props.onDelete()
                                            }
                                        }
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </ListItem>
            </Grid>
        )
    }
}

export {
    FlashGangMemberListItem
}