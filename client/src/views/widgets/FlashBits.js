import { withTheme } from '@material-ui/styles';

import { Button as OriginalButton } from '@material-ui/core';
import React, { Component } from 'react';

class FlashButtonStyled extends Component {
    render() {
        var additionalStyle={};
        if (this.props.buttonType==='system') {
            additionalStyle=this.props.theme.systemButton
        }
        return (
            <OriginalButton {...this.props} style={additionalStyle}></OriginalButton>
        )
    }
}

class FlashListItemStyled extends Component {
    render() {

        return (
            <OriginalButton {...this.props} style={this.props.theme.listItem}>
            </OriginalButton>
        )
    }
}
const FlashButton= withTheme(FlashButtonStyled);
const FlashListItem= withTheme(FlashListItemStyled);

export {
    FlashButton,
    FlashListItem
}