import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import {
    Col,
    Input
} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



class FlashDeckTest extends React.Component {
    constructor(props){
        super(props)
        this.setTestType=this.setTestType.bind(this)
        this.setAnswerType=this.setAnswerType.bind(this)
        this.state={valid:false}
    }
    setTestType(event){
        this.props.flashDeck.testType = event.target.value
        if (this.props.flashDeck.testType && this.props.flashDeck.answerType){
            this.setState({valid:true})
        }
    }
    setAnswerType(event){
        this.props.flashDeck.answerType = event.target.value
        if (this.props.flashDeck.testType && this.props.flashDeck.answerType){
            this.setState({valid:true})
        }
    }
    render() {
        const flashDeck = this.props.flashDeck
        return (
            <>
                <Grid container
                    direction="column"
                    justify="space-between"
                    alignItems="stretch"
                >
                    <div>
                        Test mode
                    </div>
                    <RadioGroup aria-label="testtype" name="testtype" onChange={this.setTestType}>
                        <FormControlLabel value="REVISION" control={<Radio />} label="Revision" name="FormControlLabelButton"/>
                        <FormControlLabel value="CRAM" control={<Radio />} label="Cram" name="FormControlLabelButton" />
                        <FormControlLabel value="EXAM" control={<Radio />} label="Exam" name="FormControlLabelButton" />
                    </RadioGroup>
                    <div>
                        Answer type
                    </div>
                    <RadioGroup aria-label="answertype" name="answertype" onChange={this.setAnswerType}>
                        <FormControlLabel value="SINGLE" control={<Radio />} label="Single answer" name="FormControlLabelButton"/>
                        <FormControlLabel value="MULTIPLE" control={<Radio />} label="Multiple choice" name="FormControlLabelButton" />
                    </RadioGroup>
                    <Grid container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                    >
                    <FlashButton
                        name='beginTest'
                        color='primary'
                        variant='contained'
                        style={{width:'51%'}}
                        disabled={!this.state.valid}
                        onClick={() => { this.props.nextCard(this.props.flashDeck) }}
                    >
                        Begin test
                    </FlashButton>
                    <FlashButton
                        name='editTest'
                        color='primary'
                        variant='contained'
                        style={{width:'51%'}}
                        onClick={() => { this.props.onEditButtonPress(this.props.flashDeck.id) }}
                    >
                        Edit test
                    </FlashButton>
                    </Grid>
                </Grid>
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