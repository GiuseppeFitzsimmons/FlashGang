import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { FlashButton } from '../widgets/FlashBits'

export default class Upgrade extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false}
        this.handleClose = this.handleClose.bind(this);
    }
    open(){
        this.setState({open: true})
    }
    handleClose(){
        this.setState({open: false})
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
                open={this.state.open}
            >
                <DialogTitle id="confirmation-dialog-title">Select Decks</DialogTitle>

                <DialogContent dividers>
                </DialogContent>

                <DialogActions>
                    <FlashButton onClick={this.handleClose} color="primary" buttonType='system'>
                        Close
                    </FlashButton>
                </DialogActions>
            </Dialog>
        )
    }
}
