import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { Input } from '@material-ui/core';
import {
  Col, Row
} from "reactstrap";

class IntegratedInput extends Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
      }
    state = { isOpen: false };

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate", this.props.value);
        //this.inputField.current.value=this.props.value
        
        
    }
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
                <Col>
                {_label}
                <Input
                    invalid={_invalid}
                    label={this.props.label}
                    id={this.props.id}
                    placeholder={this.props.placeholder}
                    type={this.props.type}
                    value={this.state.value ? this.state.value : this.props.value}
                    onChange={
                        (e)=> {
                            this.setState({
                                value: e.target.value
                            })
                            this.props.onChange(e)
                        }
                    }
                    ref={this.inputField} 
                />
                </Col>
                {_tooltip}
                
            </span>
        );
    }
}

export default IntegratedInput;