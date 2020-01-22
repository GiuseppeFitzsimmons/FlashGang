import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import RenderToLayer from 'material-ui/internal/RenderToLayer';
import { render } from 'react-dom';
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';

class AdminUsersEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = { modalShowing: this.props.modalShowing, user: this.props.user }
    }

    render() {
        console.log('userseditor state', this.state)
        return (
            <Dialog
                open={this.state.modalShowing}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                user={this.state.user}
                newFirstName=''
                newLastName=''
            >
                <DialogContent>
                    <div>
                        <TextField
                            placeholder={this.state.user.firstName}
                            onChange={(event) => {
                                this.props.newFirstName = event.target.value
                                console.log('newFirstName ', this.props.newFirstName)
                            }}
                        >
                        </TextField>
                    </div>
                </DialogContent>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        if (this.props.newFirstName.length > 0) {
                            this.props.user.firstName = this.props.newFirstName
                        }
                        if (this.props.newLastName.length > 0) {
                            this.props.user.newLastName = this.props.newLastName
                        }
                        this.setState({ modalShowing: false })
                    }}
                >
                    Save
                </FlashButton>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        this.props.newFirstName = ''
                        this.props.newLastName = ''
                        this.setState({ modalShowing: false })
                        this.props.saveUser(this.props.user)
                    }}
                >
                    Cancel
                </FlashButton>
            </Dialog>
        )

    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops users', state.users)
    return { users: state.users, cursor: state.cursor }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersEditor)