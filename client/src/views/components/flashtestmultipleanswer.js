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
import {FlashButton, FlashCheckBox, FlashRadio} from '../widgets/FlashBits'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';

export default class FlashTestMultipleAnswer extends React.Component {
    constructor(props){
        super(props)
        this.setUserAnswers=this.setUserAnswers.bind(this)
    }
    setUserAnswers(event){
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        if (!card.userAnswer){
            card.userAnswer = []
        }
        if (event.target.checked){
            card.userAnswer.push(event.target.value)
        } else {
            card.userAnswer = card.userAnswer.filter(value=>value!=event.target.value)
        }
    }
    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        let renderable = card.multipleChoices.map( (answer,index)=>{
            return (
            <FormControlLabel 
                value={answer} 
                key={"FormControlLabelButton"+index}
                control={
                    card.correctAnswers.length>1?
                        <FlashCheckBox 
                            onChange={(event) => {this.setUserAnswers(event)}}
                            ref={flashCheckBox=>{
                                if (flashCheckBox) {
                                    flashCheckBox.reset();
                                }
                            }}
                        />
                        :
                        <FlashRadio
                        value={answer}
                        checked={card.userAnswer = card.userAnswer}
                         onChange={(event) => { card.userAnswer = event.target.value; this.forceUpdate() }}
                         name='FormControlLabelButton'
                        />
                } 
                label={answer} 
                name="FormControlLabelButton"
                />
            )
        })
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <Grid>
                    {card.question}
                    <RadioGroup aria-label="testtype" name="testtype"
                        //value=""
                        //onChange={(event) => { card.userAnswer = event.target.value }}
                        >
                        {renderable}
                    </RadioGroup>
                    <FlashButton
                    onClick={()=>{this.props.onNextCard(this.props.flashDeck)}}
                    buttonType='action'
                    iconRight='navigate_next'
                    style={{width:'100%'}}
                    buttonType='system'
                    >
                        Next Card
                    </FlashButton>
                </Grid>
            </Grid>
        )
    }
}