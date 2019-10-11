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
import {FlashTypography} from '../widgets/FlashBits';

export default class FlashCardScore extends React.Component {
    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        let renderable = {}
        if (card.correct){
            renderable = 
            <>
            <FlashTypography variant="h4" gutterBottom>
                Correct answer!
            </FlashTypography>
            <FlashTypography variant="h4" gutterBottom correct>
                {card.correctAnswers.join(', ')}
            </FlashTypography>
            </>
        } else {
            renderable = 
            <>
            <FlashTypography variant="h4" gutterBottom incorrect>
                Incorrect Answer!
            </FlashTypography>
            {
                //How about this? When in cram mode, you don't get to see the correct answer
                this.props.flashDeck.testType!='CRAM' &&
                <>
                    <FlashTypography variant="h6" gutterBottom>
                    The correct answer was: 
                    </FlashTypography>
                    <FlashTypography variant="h5" gutterBottom correct>
                        {card.correctAnswers.join(', ')}
                    </FlashTypography>
                </>
            }
            <FlashTypography variant="h6" gutterBottom>
            Your answer was: 
            </FlashTypography>
            <FlashTypography variant="h5" gutterBottom incorrect>
            {Array.isArray(card.userAnswer)?card.userAnswer.join(', '): card.userAnswer}
            </FlashTypography>
            </>
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <Grid>
            <FlashTypography variant="h4" gutterBottom>
            {card.question}
            </FlashTypography>
                    
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