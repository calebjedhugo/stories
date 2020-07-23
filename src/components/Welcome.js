import React, {Component} from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron';

export default class Welcome extends Component {
  render(){
    const {firstName} = this.props
    return (
      <Jumbotron>
        <h2>Welcome, {firstName}!</h2>
      </Jumbotron>
    )
  }
}
