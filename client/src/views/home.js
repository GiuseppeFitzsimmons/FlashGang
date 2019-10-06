import React from 'react';
//import logo from '../logo.svg';
import '../App.css';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.loadDecks()
  }


  render() {
    const generateFlashDeckList = () => {
      if (!this.props.flashDecks){
        return (
          <></>
        )
      }
      console.log('this.props.flashDecks', this.props.flashDecks)
      var _display = Array.from(this.props.flashDecks).forEach((flashDeck) => {
        return (
          <div>
            {flashDeck.name}
          </div>)
      })
      return (
        <div>
          {_display}
        </div>
      )
    }
    return (
      <div>
        <AwesomeButton type="primary"
          style={{ width: '80%' }}
          onPress={
            this.props.setMode
          }>
          New FlashDeck
	      </AwesomeButton>
        <div>
          {generateFlashDeckList()}
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, props) {
  console.log('state', state)
  return { flashDecks: state.flashDecks }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)