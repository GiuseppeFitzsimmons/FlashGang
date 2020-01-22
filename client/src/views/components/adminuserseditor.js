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
        this.state = { modalShowing: this.props.modalShowing, editableUser: this.props.user, newFirstName: '', newLastName: '' }
    }
    componentDidMount(){
        this.setState({newFirstName: '', newLastName: '' })
    }
    componentDidUpdate(){
        this.setState({newFirstName: '', newLastName: '' })
    }

    render() {
        console.log('userseditor state', this.state)
        return (
            <Dialog
                open={this.props.modalShowing}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                //user={this.state.user}
                //var editableUser = {this.state.user}
            >
                <DialogContent>
                    <div>
                        <TextField
                            placeholder={this.props.user.firstName}
                            onChange={(event) => {
                                this.state.newFirstName = event.target.value
                                console.log('newFirstName ', this.state.newFirstName)
                            }}
                        >
                        </TextField>
                    </div>
                </DialogContent>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        if (this.state.newFirstName.length > 0) {
                            this.props.user.firstName = this.state.newFirstName
                        }
                        if (this.state.newLastName.length > 0) {
                            this.props.user.newLastName = this.state.newLastName
                        }
                        this.setState({ modalShowing: false })
                        this.props.saveUser(this.props.user)
                    }}
                >
                    Save
                </FlashButton>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        this.state.newFirstName = ''
                        this.state.newLastName = ''
                        this.setState({ modalShowing: false })
                        
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