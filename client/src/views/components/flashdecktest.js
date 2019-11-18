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
import { FlashTypography } from '../widgets/FlashBits';
import Divider from '@material-ui/core/Divider';
import HighScores from './highscores'



class FlashDeckTest extends React.Component {
    constructor(props) {
        super(props)
        this.setTestType = this.setTestType.bind(this)
        this.setAnswerType = this.setAnswerType.bind(this)
        this.state = { valid: false }
    }
    setTestType(event) {
        this.props.flashDeck.testType = event.target.value
        if (this.props.flashDeck.testType && this.props.flashDeck.answerType &&
            this.props.flashDeck.flashCards && this.props.flashDeck.flashCards.length>0) {
            this.setState({ valid: true })
        }
    }
    setAnswerType(event) {
        this.props.flashDeck.answerType = event.target.value
        if (this.props.flashDeck.testType && this.props.flashDeck.answerType &&
            this.props.flashDeck.flashCards && this.props.flashDeck.flashCards.length>0) {
            this.setState({ valid: true })
        }
    }
    render() {
        const flashDeck = this.props.flashDeck
        const editable=(this.props.flashDeck.rank == 'BOSS' || this.props.flashDeck.rank == 'LIEUTENANT' || this.props.flashDeck.owner == this.props.user.id) &&
                (this.props.flashDeck.state!='TO_INVITE' && this.props.flashDeck.state!='INVITED')
        return (
            <>
                <Grid container
                    direction="column"
                    justify="space-between"
                    alignItems="stretch"
                >
                    <FlashTypography variant="h6" gutterBottom>
                        Test mode
                    </FlashTypography>
                    <RadioGroup aria-label="testtype" name="testtype" onChange={this.setTestType}>
                        <FormControlLabel value="REVISION" control={<Radio />} label="Revision" name="FormControlLabelButton" />
                        <FormControlLabel value="CRAM" control={<Radio />} label="Cram" name="FormControlLabelButton" />
                        <FormControlLabel value="EXAM" control={<Radio />} label="Exam" name="FormControlLabelButton" />
                    </RadioGroup>
                    <Divider />
                    <FlashTypography variant="h6" gutterBottom>
                        Answer type
                    </FlashTypography>
                    <RadioGroup aria-label="answertype" name="answertype" onChange={this.setAnswerType}>
                        <FormControlLabel value="SINGLE" control={<Radio />} label="Single answer" name="FormControlLabelButton" />
                        <FormControlLabel value="MULTIPLE" control={<Radio />} label="Multiple choice" name="FormControlLabelButton" />
                    </RadioGroup>
                    <Divider />
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                    >
                        <FlashButton
                            name='beginTest'
                            color='primary'
                            icon='flight_takeoff'
                            variant='contained'
                            buttonType='system'
                            style={{ width: editable ? '49%': '100%' }}
                            disabled={!this.state.valid}
                            onClick={() => { 
                                this.props.nextCard(this.props.flashDeck);
                            }}
                        >
                            Begin test
                        </FlashButton>
                        <FlashButton
                            name='editTest'
                            icon='edit'
                            color='primary'
                            variant='contained'
                            buttonType='system'
                            style={{ 
                                width: '49%', 
                                display: editable ? '': 'none' }}
                            onClick={() => { this.props.onEditButtonPress(this.props.flashDeck.id) }}
                        >
                            Edit test
                        </FlashButton>
                    </Grid>
                    <HighScores
                        flashDeck = {this.props.flashDeck}
                        user = {this.props.user}
                    />
                </Grid>
            </>
        )
    }
}

function mapStateToProps(state, props) {
    return {user: state.user}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashDeckTest)