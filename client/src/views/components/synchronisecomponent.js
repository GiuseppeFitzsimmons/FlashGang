import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class SynchroniseComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        if (this.props.callSynchronise){
            this.props.synchronise()
        }
    }
    componentDidUpdate() {
        if (this.props.session && this.props.session.expired===true) {
            console.log("SESSIONBUG Synchronise component componentDidUpdate expired", this.props);
            this.props.session.expired=false;
            this.props.onSessionExpired(this.props.logout);
        }
    }

    render() {
        return (
            <>
            </>
        )

    }
}

function mapStateToProps(state, props) {
    console.log("SESSIONBUG Synchronise component mapStateToProps", state);
    return {
        session: {expired: state.sessionExpired}
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SynchroniseComponent)