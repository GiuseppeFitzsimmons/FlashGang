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
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

export default class FlashTestMultipleAnswer extends React.Component {
    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        let renderable = card.multipleChoices.map(answer=>{
            return (
            <FormControlLabel value={answer} control={<Radio />} label={answer} name="FormControlLabelButton"/>
            )
        })
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <Grid>
                    {card.question}
                    <RadioGroup aria-label="testtype" name="testtype" onChange={(event) => { card.userAnswer = event.target.value }}>
                        {renderable}
                    </RadioGroup>
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