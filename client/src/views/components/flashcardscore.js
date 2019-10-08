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
import {FlashButton} from '../widgets/FlashBits'

export default class FlashCardScore extends React.Component {
    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        console.log('this.props.flashDeck', this.props.flashDeck)
        let renderable = {}
        if (card.correct){
            renderable = 
            <>
            <div>
                Correct answer!
            </div>
            <div>
            {card.correctAnswers[0]}
            </div>
            </>
        } else {
            renderable = 
            <>
            <div>
                Incorrect Answer!
            </div>
            <div>
                The correct answer was:
            {card.correctAnswers[0]}
            </div>
            <div>
                Your answer was:
            {card.userAnswer}
            </div>
            </>
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <Grid>
                    {card.question}
                    {renderable}
                    <FlashButton
                    onClick={()=>{this.props.onNextCard(this.props.flashDeck)}}
                    buttonType='action'
                    >
                        Next Card
                    </FlashButton>
                </Grid>
            </Grid>
        )
    }
}