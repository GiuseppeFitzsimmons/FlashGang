import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import {
  Button,
  Col,
  Input
} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';

class FlashDeckTest extends React.Component {
    render() {
        const flashDeck = this.props.flashDeck
      return (
        <>
        <div>
            Test mode
        </div>
        <Input
            type='radio'
            onPress={()=>{
                this.props.flashDeck.testType = 'REVISION'
            }}
        >
        Revision
        </Input>
        <Input
            type='radio'
            onPress={()=>{
                this.props.flashDeck.testType = 'CRAM'
            }}
        >
        Cram
        </Input>
        <Input
            type='radio'
            onPress={()=>{
                this.props.flashDeck.testType = 'EXAM'
            }}
        >
        Exam
        </Input>
        <div>
            Answer type
        </div>
        <Input
            type='radio'
            onPress={()=>{
                this.props.flashDeck.answerType = 'SINGLE'
            }}
        >
            Single answer
        </Input>
        <Input
            type='radio'
            onPress={()=>{
                this.props.flashDeck.answerType = 'MULTIPLE'
            }}
        >
            Multiple choice
        </Input>
        <Button
        onPress={()=>{this.props.nextCard()}}
        >
            Begin test
        </Button>
        <Button
        onClick={()=>{this.props.onEditButtonPress(this.props.flashDeck.id)}}
        >
            Edit test
        </Button>
        </>
      )
    }
  }

function mapStateToProps(state, props) {
    return {}
  }
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(FlashDeckTest)