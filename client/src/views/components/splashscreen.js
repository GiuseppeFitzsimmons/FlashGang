import React from 'react';
import Zoom from 'react-reveal/Zoom';

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Zoom left when={this.props.showing}>
                <div style={{
                    zIndex: this.props.showing ? 99 : 0,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'Pink'
                }}>
                    SPLASH! You've been splashed.
                </div>
            </Zoom>
        )
    }
}