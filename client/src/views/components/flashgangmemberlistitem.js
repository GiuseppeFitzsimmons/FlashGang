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


class FlashGangMemberListItemStyled extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editing: false, rank: 'MEMBER' }
    }
    render() {
        var editLevel=2;
        if (this.props.flashGang) {
            if (this.props.flashGang.rank=='LIEUTENANT') {
                editLevel=1;
            } else if (this.props.flashGang.rank=='BOSS') {
                editLevel=0;
            }
        }
        return (
            <Grid>
                <div style={{ 
                            position: 'relative', 
                            top: 0, left: 0, 
                            display: editLevel<2 && this.props.gangMember.rank!='BOSS' ? '' : 'none', zIndex: 99,
                            bottomMargin: '18px'
                        }}>
                    <div style={{ 
                                position: 'absolute', 
                                top: 0, left: 0, 
                            ...this.props.theme.systemButton}}>
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
                                    this.props.onDelete()
                                }
                            }
                        />

                    </div>
                </div>
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
                            backgroundColor='blue'
                            >
                              <Icon style={{ fontSize: 30 }}>{this.props.gangMember.icon}</Icon>
                            </ListItemAvatar>
                        </Grid>
                        <Grid
                            item
                            xs='9'
                        >
                            <Grid
                                container
                                direction='row'
                                alignItems='flex-end'
                                justify='space-between'
                            >
                                <Grid
                                    item
                                    xs='11'
                                >
                                    <div
                                        style={{
                                            display: !this.state.editing ? 'block' : 'none'
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
                                            display: this.state.editing ? 'block' : 'none'
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
                                </Grid>
                                <Grid
                                    item
                                    xs='1'
                                >
                                    <div
                                        style={{
                                            display: !this.state.editing ? 'block' : 'none'
                                        }}
                                    >
                                        {
                                            this.props.gangMember.rank=='BOSS' &&
                                                <GiBrutalHelm style={this.props.theme.icon}/>
                                        }
                                        {
                                            this.props.gangMember.rank=='LIEUTENANT' &&
                                                <GiSwordman style={this.props.theme.icon}/>
                                        }
                                        {
                                            this.props.gangMember.rank=='MEMBER' &&
                                                <GiHoodedFigure style={this.props.theme.icon}/>
                                        }
                                    </div>
                                    <div
                                        style={{
                                            display: 
                                                this.state.editing && 
                                                editLevel<2 && 
                                                (this.props.gangMember.rank!='BOSS' || this.props.flashGang.rank=='BOSS')
                                                ? 'block' : 'none'
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
                                        {editLevel<1 &&
                                            <MenuItem value={'BOSS'}>
                                                <GiBrutalHelm style={this.props.theme.icon}/>
                                            </MenuItem>
                                        }
                                        {editLevel<2 &&
                                            <MenuItem value={'LIEUTENANT'}>
                                                    <GiSwordman style={this.props.theme.icon}/>
                                            </MenuItem>
                                        }
                                            <MenuItem value={'MEMBER'}>
                                                <GiHoodedFigure style={this.props.theme.icon}/>
                                            </MenuItem>
                                        </Select>

                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ListItem>
            </Grid>
        )
    }
}
const FlashGangMemberListItem=withTheme(FlashGangMemberListItemStyled);
export {
    FlashGangMemberListItem
}