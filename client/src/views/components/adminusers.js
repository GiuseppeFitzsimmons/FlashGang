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



class AdminUsers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {open: this.props.open}
        var users = {}
    }
    
    componentDidMount() {
        console.log('adminusers componentdidmount')
        this.users = this.props.getAllUsers()
        this.setState({users:this.users})
        //console.log('users from adminusers', users)
    }
    componentDidUpdate() {
        console.log('adminusers componentdidupdate users', this.users)
    }
    render() {
        console.log('adminusers render')
        /*const generateUserList=()=>{
        }
        generateUserList()*/
        console.log('adminusers', this.users)
        return (
            <>

            </>
        )
    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops')
    return {}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers)