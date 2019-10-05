import React from 'react';
//import logo from '../logo.svg';
import '../App.css';
import { AwesomeButton } from "react-awesome-button";

export default class Home extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <AwesomeButton type="primary"
        style={{ width: '80%' }}
        onPress={
          this.props.setMode
        }>
        New FlashDeck
	    </AwesomeButton>
    )
  }
}
