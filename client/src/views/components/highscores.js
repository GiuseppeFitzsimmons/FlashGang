import React from 'react';

export default class HighScores extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                High Scores bruv
                {this.props.flashDeck.source}
            </div>
        )
    }
}
