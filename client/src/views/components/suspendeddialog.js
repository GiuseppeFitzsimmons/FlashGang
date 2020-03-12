import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { FlashButton } from '../widgets/FlashBits'
import { Grid } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class SuspendedDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false }
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidUpdate() {
        console.log('suspenddialog update, this.state', this.state)
    }
    handleClose() {
        this.setState({ open: false })
    }
    render() {
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                fullWidth={true}
                maxWidth='lg'
                onEntering={this.handleEntering}
                aria-labelledby="confirmation-dialog-title"
                open={this.props.suspended}
            >
                <DialogTitle id="confirmation-dialog-title">Suspended</DialogTitle>

                <DialogContent dividers>
                    <Grid container
                        direction="column"
                        justify="space-between"
                        alignItems="flex-start">
                        <Grid
                            container
                            direction="row"
                        >
                            <Grid
                                item xs={10} sm={10} md={10}
                            >
                                This account has been suspended.
                                </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}

function mapStateToProps(state, props) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SuspendedDialog)