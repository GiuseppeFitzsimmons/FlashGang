import { withTheme } from '@material-ui/styles';

import { Button as OriginalButton } from '@material-ui/core';
import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';

class FlashButtonStyled extends Component {
    render() {
        var additionalStyle={};
        if (this.props.buttonType==='system') {
            additionalStyle=this.props.theme.systemButton
        } else if (this.props.buttonType==='error') {
            additionalStyle=this.props.theme.errorButton
        } else if (this.props.buttonType==='action') {
            additionalStyle=this.props.theme.actionButton
        }
        if (additionalStyle && this.props.square && this.props.width) {
            additionalStyle=Object.assign({}, additionalStyle, {borderRadius:0})
        }
        return (
            <OriginalButton {...this.props} style={additionalStyle}></OriginalButton>
        )
    }
}

class FlashListItemStyled extends Component {
    render() {
        var additionalStyle={};
        if (this.props.buttonType==='system') {
            additionalStyle=this.props.theme.systemButton
        } else if (this.props.buttonType==='error') {
            additionalStyle=this.props.theme.errorButton
        } else if (this.props.buttonType==='action') {
            additionalStyle=this.props.theme.actionButton
        }
        return (
            <ListItem {...this.props} style={this.props.theme.listItem} style={additionalStyle}>
            </ListItem>
        )
    }
}
const FlashButton= withTheme(FlashButtonStyled);
const FlashListItem= withTheme(FlashListItemStyled);

export {
    FlashButton,
    FlashListItem
}