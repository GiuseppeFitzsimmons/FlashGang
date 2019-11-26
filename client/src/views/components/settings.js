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
import Avatar from '@material-ui/core/Avatar';
import FlashAppBar from '../widgets/flashappbar'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = { user: {} }
        this.handleFileChange=this.handleFileChange.bind(this)
    }
    componentDidMount() {
        this.setState({ user: this.state.user })
        if (this.props.navEvent) {
            this.props.navEvent.backButton=this.props.goHome;
          }
    }
    handleFileChange(e) {
        let file = e.target.files; // FileList
        const settings=this;
        if (file) {
            let reader = new FileReader();
            reader.onload = function() {
                let result = reader.result;
                console.log("result", result)
                settings.state.user.picture=result;
                settings.forceUpdate();
                //let s = result.split(',');
            };
            //TODO parameterise this limitation
            if (file[0].size>2500000) {
                //TODO a proper alert dialogue
                alert("too big")
            } else {
                reader.readAsDataURL(file[0]);
            }
        }
        document.getElementById("file-upload").reset();
    }
    render() {
        return (
            <>
                <FlashAppBar title='FlashGang Settings' station='SETTINGS'
                    goGangs={this.props.goGangs}
                    onLogOut={this.props.onLogOut}
                    goSettings={this.props.goSettings} />
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="stretch">


                    <Grid container
                        justify="center"
                        alignItems="stretch">
                        <Avatar
                            src={this.state.user && this.state.user.picture ? this.state.user.picture : this.props.user.picture}
                            style={{ border: 'solid rgba(0,0,0,.5)', marginTop:'8px' }}
                            onClick={() => document.getElementById("input-file-upload").click()}
                        />
                        <form id="file-upload" autocomplete="off" style={{ display: 'none' }}>
                            <input id="input-file-upload" type="file" onChange={this.handleFileChange} accept="image/png, image/jpeg"/>
                        </form>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <IntegratedInput
                            label={'First Name'}
                            onChange={
                                (event) => { this.state.user.firstName = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(this.props.user.firstName) : true
                            }
                        >
                        </IntegratedInput>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <IntegratedInput
                            label={'Last Name'}
                            onChange={
                                (event) => { this.state.user.lastName = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(this.props.user.lastName) : true
                            }
                        >
                        </IntegratedInput>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <IntegratedInput
                            label={'Nickname'}
                            onChange={
                                (event) => { this.state.user.nickname = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(this.props.user.nickname) : true
                            }
                        >
                        </IntegratedInput>
                    </Grid>
                    <Grid item item xs={10} sm={11} md={11}
                        justify="center"
                        alignItems="stretch">
                        <FlashButton
                            onClick={() => { this.props.setSettings(this.state.user) }}
                            buttonType='system'
                            style={{ width: '100%' }}
                        >
                            Save
                    </FlashButton>
                    </Grid>
                </Grid>
            </>
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