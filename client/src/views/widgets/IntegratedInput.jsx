import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { Input } from '@material-ui/core';

class IntegratedInput extends Component {
    state = { isOpen: false };

    toggle = () => {
        //if ((this.props.message && this.props.message!='') || this.props.errors) {
        this.setState({ isOpen: !this.state.isOpen });
        //}

    };

    render() {
        var message = this.props.message
        var _invalid = false;
        if (this.props.errors && this.props.errors.fields ) {
            this.props.errors.fields.forEach(field => {
                if (field.fieldId == this.props.id || field.fieldName == this.props.id) {
                    message = field.message
                    _invalid = true;
                }
            })
        }
        var _tooltip=<i/>
        if (_invalid || (message && message!='')) {
            _tooltip=<Tooltip isOpen={this.state.isOpen} toggle={this.toggle} placement="bottom" target={this.props.id}>{message}</Tooltip>
        }
        let _label=<></>
        if (this.props.label && this.props.label!='') {
            _label=<><label>{this.props.label}</label><br/></>
        }
        return (
            <span>
                {_label}
                <Input
                    invalid={_invalid}
                    label={this.props.label}
                    id={this.props.id}
                    placeholder={this.props.placeholder}
                    type={this.props.type}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
                {_tooltip}
            </span>
        );
    }
}

export default IntegratedInput;