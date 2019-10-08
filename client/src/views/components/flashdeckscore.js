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

export default class FlashDeckScore extends React.Component {
    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        console.log('this.props.flashDeck', this.props.flashDeck)
        let correctAnswers = '30 correct answers'
        let incorrectAnswers = 'No incorrect answers'
        let percentage = '100%'
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <Grid>
                    {correctAnswers}
                    {incorrectAnswers}
                    {percentage}
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