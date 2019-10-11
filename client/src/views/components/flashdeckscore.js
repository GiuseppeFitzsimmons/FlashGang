import React from 'react';
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashButton } from '../widgets/FlashBits'
import {FlashTypography} from '../widgets/FlashBits';

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
        if (correctAnswers > 0) {
            percentage = (correctAnswers / this.props.flashDeck.flashCards.length) * 100
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <FlashTypography variant="h5" gutterBottom correct>
                    Correct answers: {correctAnswers}
                </FlashTypography>
                <FlashTypography variant="h6" gutterBottom incorrect>
                    Incorrect answers: {incorrectAnswers}
                </FlashTypography>
                <FlashTypography variant="h5" gutterBottom incorrect={percentage<50} correct={percentage>50}>
                    {percentage}% Correct
                </FlashTypography>
                <Grid container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                >

                    <FlashButton
                        buttonType='system'
                        icon='repeat'
                        style={{ width: '49%' }}
                        onClick={this.props.onStartOver}
                    >
                        Retry
                </FlashButton>
                    <FlashButton
                        buttonType='system'
                        icon='home'
                        style={{ width: '49%' }}
                        onClick={this.props.goHome}
                    >
                        Home
                </FlashButton>
                </Grid>
            </Grid>
        )
    }
}
