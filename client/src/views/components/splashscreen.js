import React from 'react';
import Zoom from '@material-ui/core/Zoom';

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Zoom in={false} style={{ enter: 0, exit: 250}}>
                <div style={{
                    zIndex: 99,
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