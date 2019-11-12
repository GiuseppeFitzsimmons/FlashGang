import React from 'react';
import { Button, Grid, GridList, Container } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IntegratedInput from '../widgets/IntegratedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withTheme } from '@material-ui/styles';
//https://react-icons.netlify.com/#/icons/md
import { MdDelete, MdModeEdit } from 'react-icons/md';
//https://react-icons.netlify.com/#/icons/gi
import { GiSwordman, GiHoodedFigure, GiBrutalHelm } from 'react-icons/gi';
import Paper from 'material-ui/Paper';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';


const styles = theme => ({
    paper: {
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
class HighScoreItemStyled extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let name;
        let score;
        let highScore;
        if (this.props.score) {
            name = this.props.score.id
            if (this.props.score.firstName && this.props.score.lastName) {
                name = this.props.score.firstName + ' ' + this.props.score.lastName
            }
            score = this.props.score.score
            highScore = this.props.score.highScore
        } else {
            name = 'Name'
            score = 'Score'
            highScore = 'Highscore'
        }
        return (
            <Grid container spacing={0} style={{ paddingTop: '4px' }}>
                <Grid item xs={2} sm={1} md={1} style={this.props.theme.actionListItem}>
                    <Container style={{
                        height: '100%',
                        //backgroundImage: `url('${this.props.gangMember.profileImage}')`,
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat'
                    }}
                        height={'10%'}>
                    </Container>
                </Grid>
                <Grid container xs={10} sm={11} md={11} style={this.props.theme.actionListItem} direction='row'>
                    <Grid
                        xs={8} sm={8} md={8}
                    >
                        {name}
                    </Grid>
                    <Grid
                        xs={2} sm={2} md={2}
                    >
                        {score}
                    </Grid>
                    <Grid
                        xs={2} sm={2} md={2}
                    >
                        {highScore}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
const HighScoreItem = withTheme(HighScoreItemStyled);
export {
    HighScoreItem
}