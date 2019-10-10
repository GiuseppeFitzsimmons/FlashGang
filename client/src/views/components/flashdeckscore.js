import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashButton } from '../widgets/FlashBits'

export default class FlashDeckScore extends React.Component {
    render() {
        let correctAnswers = 0
        let incorrectAnswers = 0
        let percentage = 0
        for (var i in this.props.flashDeck.flashCards) {
            let card = this.props.flashDeck.flashCards[i]
            if (card.correct) {
                correctAnswers++
            } else {
                incorrectAnswers++
            }
        }
        if (correctAnswers>0){
            percentage = (correctAnswers / this.props.flashDeck.flashCards.length) * 100
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <div>
                    Correct answers: {correctAnswers}
                </div>
                <div>
                    Incorrect answers: {incorrectAnswers}
                </div>
                <div>
                    {percentage}% correct answers
                    </div>
                <FlashButton
                    buttonType='action'
                >
                    Next Card
                    </FlashButton>
            </Grid>
        )
    }
}
