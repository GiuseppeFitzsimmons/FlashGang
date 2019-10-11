import { withTheme } from '@material-ui/styles';

import { Button as OriginalButton } from '@material-ui/core';
import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';

import Typography from '@material-ui/core/Typography';

import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';

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
        var additionalProps={}
        if (this.props.icon) {
            additionalProps.startIcon=<Icon style={{ fontSize: 20 }}>{this.props.icon}</Icon>
        }
        if (this.props.iconRight) {
            additionalProps.endIcon=<Icon style={{ fontSize: 20 }}>{this.props.iconRight}</Icon>
        }
        var thisProps=Object.assign({}, this.props, additionalProps);
        return (
            <OriginalButton {...thisProps} style={additionalStyle}></OriginalButton>
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
class FlashCheckBoxStyled extends Component {
    state={on:false}
    reset() {
        this.setState({on:false});
    }
    render() {
        return (
            <Checkbox {...this.props} checked={this.state.on}
                onChange={
                    (e)=> {
                        this.setState({on:e.target.checked})
                        if (this.props.onChange) this.props.onChange(e)
                    }
                }
            />
        )
    }
}
class RadioStyled extends Component {
    state={checked:false}
    radioRef=React.createRef();
    reset() {
        this.setState({checked:false});
    }
    render() {
        const props=Object.assign({}, this.props, {checked: this.state.checked});
        return (
            <Radio {...props}
                onChange={
                    (e)=> {
                        console.log("radio props",this.props);
                        this.setState({checked:e.target.checked})
                        if (this.props.onChange) this.props.onChange(e)
                    }
                }
            />
        )
    }
}
const FlashButton= withTheme(FlashButtonStyled);
const FlashListItem= withTheme(FlashListItemStyled);
const FlashTypography=withTheme(FlashTypographyStyled);
const FlashCheckBox=withTheme(FlashCheckBoxStyled);
const FlashRadio=withTheme(RadioStyled);

export {
    FlashButton,
    FlashListItem,
    FlashTypography,
    FlashCheckBox,
    FlashRadio
}