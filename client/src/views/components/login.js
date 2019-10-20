import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput';
import { FlashButton } from '../widgets/FlashBits';


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = { user: {}, mode: 'LOGIN' }
    }
    componentDidUpdate() {
        console.log('this.props', this.props)
        if (this.props.loggedIn) {
            console.log('onLoggedIn 1')
            if (this.props.onLoggedIn) {
                console.log('onLoggedIn 2')
                this.props.onLoggedIn()
            }
        }
    }

    render() {
        let renderable =
            <>
                <IntegratedInput
                    label='Username'
                    placeholder='Username'
                    onChange={
                        (event) => {
                            this.state.user.userName = event.target.value
                        }
                    }
                    ref={
                        input => input ? input.reset('') : true
                    }
                />
                <IntegratedInput
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
                    onClick={
                        () => { this.props.login(this.state.user) }
                    }
                >
                    Log in
                </FlashButton>
                <FlashButton
                    color='primary'
                    variant='contained'
                    buttonType='system'
                    onClick={
                        () => { this.setState({ mode: 'CREATE' }) }
                    }
                >
                    Create account
                </FlashButton>
            </>
        if (this.state.mode != 'LOGIN') {
            renderable =
                <>
                    <IntegratedInput
                        label='Username'
                        placeholder='Username'
                        onChange={
                            (event) => {
                                this.state.user.userName = event.target.value
                            }
                        }
                        ref={
                            input => input ? input.reset('') : true
                        }
                    />
                    <IntegratedInput
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
                        onClick={
                            () => { this.setState({ mode: 'LOGIN' }) }
                        }
                    >
                        Cancel
                    </FlashButton>
                </>
        }
        return (
            <>{renderable}</>
        )
    }
}

function mapStateToProps(state, props) {
    return { loggedIn: state.loggedIn }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)