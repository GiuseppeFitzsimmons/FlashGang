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

export default class FlashTestSingleAnswer extends React.Component {
    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <Grid>
                    {card.question}
                    <IntegratedInput
                        label={'Answer'}
                        placeholder={'Correct answer '}
                        onChange={
                            (event) => { card.userAnswer = event.target.value }
                        }
                        ref={
                            input=>input ? input.reset('') : true
                        }
                    >
                    </IntegratedInput>
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