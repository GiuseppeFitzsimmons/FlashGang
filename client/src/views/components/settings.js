import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashButton } from '../widgets/FlashBits'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: {}}
    }
    componentDidMount() {
        this.setState({ user: this.state.user })
    }
    render() {
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                {this.props.user.picture}
                <Grid item xs={12} sm={12} md={12}>
                    <IntegratedInput
                        label={'First Name'}
                        onChange={
                            (event) => { this.state.user.firstName = event.target.value }
                        }
                        ref={
                            input=>input ? input.reset(this.props.user.firstName) : true
                        }
                    >
                    </IntegratedInput>
                    <IntegratedInput
                        label={'Last Name'}
                        onChange={
                            (event) => { this.state.user.lastName = event.target.value }
                        }
                        ref={
                            input=>input ? input.reset(this.props.user.lastName) : true
                        }
                    >
                    </IntegratedInput>
                    <IntegratedInput
                        label={'Nickname'}
                        onChange={
                            (event) => { this.state.user.nickname = event.target.value }
                        }
                        ref={
                            input=>input ? input.reset(this.props.user.nickname) : true
                        }
                    >
                    </IntegratedInput>
                    <FlashButton
                        onClick={() => { this.props.setSettings(this.state.user) }}
                        buttonType='action'
                    >
                        Save
                    </FlashButton>
                </Grid>
            </Grid>
        )
    }
}

function mapStateToProps(state, props) {
    console.log('state user settings', state)
    return {
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)