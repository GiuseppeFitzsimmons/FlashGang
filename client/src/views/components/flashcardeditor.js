import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import { Input } from 'reactstrap'
import IntegratedInput from '../widgets/IntegratedInput'
import {
  Col
} from "reactstrap";

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
                let removeButton = <></>
                {
                    if (i>0 && i == flashCard.correctAnswers.length-1) {
                        removeButton =
                            <div

                            >
                                <MdDelete
                                    onClick={
                                        () => {
                                            this.removeCorrectAnswer(i)
                                        }
                                    }
                                />
                            </div>
                    }
                }
                let label="Correct Answer";
                if (i>0) {
                    label='';
                }
                return (
                    <div>
                    <Col>
                        {answer}
                        <IntegratedInput
                            label={label}
                            value={answer}
                            placeholder='flash card correct answer'
                            onChange={
                                (event) => {
                                    flashCard.correctAnswers[i] = event.target.value
                                }
                            }
                        />
                        {removeButton}
                        </Col>
                    </div>)
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
                let removeButton = <></>
                {
                    if (i == flashCard.incorrectAnswers.length-1) {
                        removeButton =
                            <div

                            >
                                <MdDelete
                                    onClick={
                                        () => {
                                            this.removeIncorrectAnswer(i)
                                        }
                                    }
                                />
                            </div>
                    }
                }
                let label="Incorrect Answer";
                if (i>0) {
                    label='';
                }
                return (
                    <div>
                    <Col>
                        {answer}
                        <IntegratedInput
                            label={label}
                            defaultValue={answer}
                            placeholder='flash card incorrect answer'
                            onChange={
                                (event) => { flashCard.incorrectAnswers[i] = event.target.value }
                            }
                        />
                        {removeButton}
                        </Col>
                    </div>)
            })
            return (
                <div>
                    {_display}
                </div>
            )
        }
        return (
            <>
                <Col>
                <IntegratedInput
                    label="Question"
                    defaultValue={flashCard.question}
                    placeholder='flash card question'
                    onChange={
                        (event) => { flashCard.question = event.target.value }
                    }
                    
                />
                 </Col>
                {generateCorrectAnswerList()}
                <Col>
                <AwesomeButton
                    onPress={
                        this.addCorrectAnswer
                    }
                >
                    Add correct answer
                </AwesomeButton>
                </Col>
                <Col>
                {generateIncorrectAnswerList()}
                <AwesomeButton
                    onPress={
                        this.addIncorrectAnswer
                    }
                >
                    Add incorrect answer
                </AwesomeButton>
                </Col>
                <Col>
                <AwesomeButton
                    onPress={() => this.props.nextCard(this.props.flashDeck)}
                >
                    Next Card
                </AwesomeButton>
                </Col>
                <Col>
                <AwesomeButton
                    onPress={() => {
                        this.props.saveDeck(this.props.flashDeck)
                        console.log('flashCard', flashCard)
                    }

                    }
                >
                    Save Deck
                </AwesomeButton>
                </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(FlashCardEditor)