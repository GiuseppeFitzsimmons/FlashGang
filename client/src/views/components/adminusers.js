import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import {
    Col,
    Input
} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { FlashTypography } from '../widgets/FlashBits';
import FlashAppBar from '../widgets/flashappbar';
import { RadioButton } from 'material-ui';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Checkbox from '@material-ui/core/Checkbox';



class AdminUsers extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: this.props.open }
        this.subscription = ['member', 'lieutenant', 'boss']
        this.suspension = false
    }

    componentDidMount() {
        console.log('adminusers componentdidmount')
        this.props.getAllUsers()
        console.log('componentDidMount: subscription filter is set to', this.subscription, 'suspension filter is set to', this.suspension)
    }
    componentDidUpdate() {
        console.log('componentDidUpdate: subscription filter is set to', this.subscription, 'suspension filter is set to', this.suspension)
    }
    render() {
        var index = ''
        const setSubscription = (value, checked) => {
            console.log('filter set to', value)
            if (checked) {
                this.subscription.push(value)
            } else {
                index = this.subscription.indexOf(value)
                this.subscription.splice(index, 1)
            }
            console.log('current subscriptions', this.subscription)
        }
        const setSuspension = (checked) => {
            console.log('suspension set to', checked)
            if (checked){
                this.suspension = true
            } else {
                this.suspension = false
            }
        }
        const generateUserList = () => {
            if (this.props.users) {
                this.userArray = this.props.users.map((user) =>
                    <li>
                        {user.firstName + '\n'}
                        {user.lastName + '\n'}
                        {user.id + '\n'}
                        {user.subscription ? user.subscription : 'member'}
                    </li>
                )
            }
        }
        generateUserList()
        console.log('adminusers', this.props.users)
        return (
            <Grid>
                Member
                <Checkbox
                    defaultChecked
                    color="default"
                    value="member"
                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                    onChange={
                        (event) => {
                            setSubscription(event.target.value, event.target.checked)
                        }}
                />
                Lieutenant
                <Checkbox
                    defaultChecked
                    color="default"
                    value="lieutenant"
                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                    onChange={
                        (event) => {
                            setSubscription(event.target.value, event.target.checked)
                        }}
                />
                Boss
                <Checkbox
                    defaultChecked
                    color="default"
                    value="boss"
                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                    onChange={
                        (event) => {
                            setSubscription(event.target.value, event.target.checked)
                        }}
                />
                Suspended
                <Checkbox
                    //defaultChecked
                    color="default"
                    value="suspended"
                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                    onChange={
                        (event) => {
                            setSuspension(event.target.checked)
                        }}
                />
                <Button
                    onClick={() => {
                        console.log('filters onClick', this.subscription)
                        this.props.getAllUsers({ subscription: this.subscription, suspension: this.suspension })
                    }}
                >
                    Fetch users
                </Button>
                <Grid>
                    {this.userArray}
                </Grid>
                <Button>
                    Next page
                </Button>
            </Grid>
        )
    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops users', state.users)
    return { users: state.users }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers)