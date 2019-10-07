import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import { Input } from 'reactstrap'
import IntegratedInput from '../widgets/IntegratedInput'
import {
    Col, Row
} from "reactstrap";
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


class FlashCardEditor extends React.Component {
    constructor(props) {
        super(props)
        this.addCorrectAnswer = this.addCorrectAnswer.bind(this)
        this.addIncorrectAnswer = this.addIncorrectAnswer.bind(this)
        this.removeCorrectAnswer = this.removeCorrectAnswer.bind(this)
        this.removeIncorrectAnswer = this.removeIncorrectAnswer.bind(this)
    }
    addCorrectAnswer() {
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].correctAnswers.push('')
        this.forceUpdate()
    }
    removeCorrectAnswer(index) {
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].correctAnswers.splice(index, 1)
        this.forceUpdate()
    }
    removeIncorrectAnswer(index) {
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers.splice(index, 1)
        this.forceUpdate()
    }
    addIncorrectAnswer() {
        if (!this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers) {
            this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers = []
        }
        this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex].incorrectAnswers.push('')
        this.forceUpdate()
    }
    render() {
        const flashCard = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        if (!flashCard.correctAnswers) {
            flashCard.correctAnswers = []
            flashCard.correctAnswers.push('')
        }

        const generateCorrectAnswerList = () => {
            var _display = flashCard.correctAnswers.map((answer, i) => {
                let removeButton = ''
                let _gridWidth = 12;
                {
                    if (i>0 && i == flashCard.correctAnswers.length - 1) {
                        _gridWidth = 11
                        removeButton =
                            <Grid >
                                <MdDelete
                                    onClick={
                                        () => {
                                            this.removeCorrectAnswer(i)
                                        }
                                    }
                                />
                            </Grid>
                    }
                }
                let label = "Correct Answer";
                if (i > 0) {
                    label = '';
                }
                return (
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-end">
                        <Grid item xs={_gridWidth} sm={_gridWidth}>
                            <IntegratedInput
                                label={label}
                                placeholder={'Correct answer '+(i+1)}
                                onChange={
                                    (event) => { flashCard.correctAnswers[i] = event.target.value }
                                }
                                ref={
                                    input=>input ? input.reset(answer) : true
                                }
                            />
                        </Grid>
                        {removeButton}
                    </Grid>)
            })
            return (
                <div>
                    {_display}
                </div>
            )
        }

        const generateIncorrectAnswerList = () => {
            if (!flashCard.incorrectAnswers) {
                return (
                    <></>
                )
            }
            var _display = flashCard.incorrectAnswers.map((answer, i) => {
                let removeButton = ''
                let _gridWidth = 12;
                {
                    if (i == flashCard.incorrectAnswers.length - 1) {
                        _gridWidth = 11
                        removeButton =
                            <Grid >
                                <MdDelete
                                    onClick={
                                        () => {
                                            this.removeIncorrectAnswer(i)
                                        }
                                    }
                                />
                            </Grid>
                    }
                }
                let label = "Incorrect Answer";
                if (i > 0) {
                    label = '';
                }
                return (
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-end">
                        <Grid item xs={_gridWidth} sm={_gridWidth}>
                            <IntegratedInput
                                label={label}
                                placeholder={'Incorrect answer '+(i+1)}
                                onChange={
                                    (event) => { flashCard.incorrectAnswers[i] = event.target.value }
                                }
                                ref={
                                    input=>input ? input.reset(answer) : true
                                }
                            />
                        </Grid>
                        {removeButton}
                    </Grid>)
            })
            return (
                <div>
                    {_display}
                </div>
            )
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="stretch"
                >
                <IntegratedInput
                    label="Question"
                    placeholder='flash card question'
                    onChange={
                        (event) => { flashCard.question = event.target.value }
                    }
                    ref={
                        input=>input ? input.reset(flashCard.question) : true
                    }
                />
                {generateCorrectAnswerList()}
                <Button
                    color='primary'
                    variant='outlined'
                    onClick={
                        this.addCorrectAnswer
                    }
                >
                    Add correct answer
                </Button>
                {generateIncorrectAnswerList()}
                <Button
                    color='primary'
                    variant='outlined'
                    onClick={
                        this.addIncorrectAnswer
                    }
                >
                    Add incorrect answer
                </Button>
                <Button
                    color='primary'
                    variant='outlined'
                    onClick={() => this.props.nextCard(this.props.flashDeck)}
                >
                    Next Card
                </Button>
                <Button
                    color='default'
                    variant='outlined'
                    onClick={() => {
                            this.props.saveDeck(this.props.flashDeck)
                            console.log('flashCard', flashCard)
                        }
                    }
                >
                    Save Deck
                </Button>
            </Grid>
        )
    }
}

function mapStateToProps(state, props) {
    return {flashCard: state.flashCard}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashCardEditor)