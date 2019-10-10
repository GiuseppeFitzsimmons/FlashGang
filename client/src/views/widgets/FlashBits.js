import { withTheme } from '@material-ui/styles';

import { Button as OriginalButton } from '@material-ui/core';
import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';

import Typography from '@material-ui/core/Typography';

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
        if (this.props.style) {
            additionalStyle=Object.assign({}, this.props.style, additionalStyle)
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

class FlashTypographyStyled extends Component {
    render() {
        var additionalStyle={};
        if (this.props.incorrect) {
            additionalStyle=this.props.theme.incorrect
        } else if (this.props.correct) {
            additionalStyle=this.props.theme.correct
        }
        return (
            <Typography {...this.props} style={additionalStyle}/>
        )
    }
}
const FlashButton= withTheme(FlashButtonStyled);
const FlashListItem= withTheme(FlashListItemStyled);
const FlashTypography= withTheme(FlashTypographyStyled);

export {
    FlashButton,
    FlashListItem,
    FlashTypography
}