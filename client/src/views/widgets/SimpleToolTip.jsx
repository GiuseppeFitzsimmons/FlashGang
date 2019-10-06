import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class SimpleTooltip extends Component {
  state = { isOpen: false };

  toggle = () => {
    //if ((this.props.message && this.props.message!='') || this.props.errors) {
      this.setState({ isOpen: !this.state.isOpen });
    //}

  };

  render() {
    var message = this.props.message
    if (message || message==''){
      console.log('These are errors',this.props.errors)
      if (this.props.errors){
        this.props.errors.fields.forEach(field=>{
          console.log('This is the field',field)
          if (field.fieldId==this.props.targetId || field.fieldName==this.props.targetId){
            message = field.message
          }
        })
      }
    }
    return <Tooltip isOpen={this.state.isOpen} toggle={this.toggle} placement="bottom" target={this.props.targetId}>{message}</Tooltip>;
  }
}

export default SimpleTooltip;