import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput';
import { FlashButton } from '../widgets/FlashBits';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, GridList } from '@material-ui/core';
import queryString, { parse } from 'query-string'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = { user: {}, mode: 'LOGIN' }
    }
    componentDidUpdate() {
        console.log('this.props from login', this.props)
        console.log('this.state from login', this.state)
        if (this.props.loggedIn) {
            if (this.props.onLoggedIn) {
                this.props.onLoggedIn()
            }
        }
    }

    render() {
        const parsedurl = queryString.parseUrl(window.location.href)
        console.log('parsedurl', parsedurl)
        let renderable =
            <>
                <IntegratedInput
                    errors={this.props.errors}
                    id='id'
                    label='Email address'
                    placeholder='user@name.com'
                    onChange={
                        (event) => {
                            this.state.user.id = event.target.value
                        }
                    }
                    ref={
                        input => input ? input.reset(this.state.user.id) : true
                    }
                />
                <IntegratedInput
                    errors={this.props.errors}
                    id='password'
                    type='password'
                    label='Password'
                    placeholder='Password'
                    onChange={
                        (event) => {
                            this.state.user.password = event.target.value
                        }
                    }
                    ref={
                        input => input ? input.reset('') : true
                    }
                />
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    style={{ width: '100%' }}
                    onClick={
                        () => { this.props.logIn(this.state.user) }
                    }
                >
                    Log in
                </FlashButton>
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    style={{ width: '100%' }}
                    onClick={
                        () => {
                            if (this.props.errors) {
                                this.props.errors.fields = []
                            }
                            this.setState({ mode: 'CREATE' })
                        }
                    }
                >
                    Create account
                </FlashButton>
                {this.props.errors && this.props.errors.fields.length > 0 &&
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { 
                                if (this.props.errors) {
                                    this.props.errors.fields = []
                                }
                                this.setState({ mode: 'FORGOTTENPW' }) 
                            }
                        }
                    >
                        Forgotten password
                </FlashButton>
                }
            </>
        if (this.state.mode == 'FORGOTTENPW') {
            renderable =
                <>
                    <IntegratedInput
                        errors={this.props.errors}
                        id='id'
                        label='Email address'
                        placeholder='user@name.com'
                        onChange={
                            (event) => {
                                this.state.user.id = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset(this.state.user.id) : true
                        }
                    />
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { this.props.resetPassword(this.state.user) }
                        }
                    >
                        Reset password
                </FlashButton>
                </>
        }
        else if (this.state.mode == 'CREATE') {
            renderable =
                <>
                    <IntegratedInput
                        errors={this.props.errors}
                        id='id'
                        label='Email address'
                        placeholder='user@name.com'
                        onChange={
                            (event) => {
                                this.state.user.id = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset(this.state.user.id) : true
                        }
                    />
                    <IntegratedInput
                        errors={this.props.errors}
                        id='password'
                        type='password'
                        label='Password'
                        placeholder='Password'
                        onChange={
                            (event) => {
                                this.state.user.password = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        type='password'
                        label='Confirm password'
                        placeholder='Confirm password'
                        onChange={
                            (event) => {
                                this.state.user.confirmPassword = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        label='First name'
                        placeholder='First name'
                        onChange={
                            (event) => {
                                this.state.user.firstName = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        label='Last name'
                        placeholder='Last name'
                        onChange={
                            (event) => {
                                this.state.user.lastName = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { this.props.createAccount(this.state.user) }
                        }
                    >
                        Create account
                    </FlashButton>
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => {
                                if (this.props.errors) {
                                    this.props.errors.fields = []
                                }
                                this.setState({ mode: 'LOGIN' })
                            }
                        }
                    >
                        Cancel
                    </FlashButton>
                </>
        } if (parsedurl.query.resetpassword) {
            let email = atob(parsedurl.query.email)
            this.state.user.id = email
            renderable =
                <>
                    <IntegratedInput
                        errors={this.props.errors}
                        id='id'
                        label='Email address'
                        placeholder='user@name.com'
                        onChange={
                            (event) => {
                                this.state.user.id = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset(email) : true
                        }
                    />
                    <IntegratedInput
                        errors={this.props.errors}
                        id='password'
                        type='password'
                        label='Password'
                        placeholder='Password'
                        onChange={
                            (event) => {
                                this.state.user.password = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
                        type='password'
                        label='Confirm password'
                        placeholder='Confirm password'
                        onChange={
                            (event) => {
                                this.state.user.confirmPassword = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <FlashButton
                        color='primary'
                        variant='contained'
                        buttonType='system'
                        style={{ width: '100%' }}
                        onClick={
                            () => { this.props.setPassword(this.state.user, parsedurl.query.token) }
                        }
                    >
                        Set password
                    </FlashButton>
                </>
        }
        return (
            <>{renderable}
                {
                    this.props.loading &&
                    <div className='sweet-loading' style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: '0', right: '0', left: '0', bottom: '0',
                        paddingTop: '50%',
                        position: 'fixed',
                        backgroundColor: 'rgb(255,255,255,.5)'
                    }} >
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <CircularProgress />
                        </Grid>
                    </div>
                }
            </>
        )
    }
}

function mapStateToProps(state, props) {
    return { loggedIn: state.loggedIn, errors: state.errors, user: state.user, loading: state.loading }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)