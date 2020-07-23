import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    admin: '',
    error: ''
  }

  render(){
    const {email, password, admin, error} = this.state
    const {setUserData} = this.props
    return (
      <Card className='loginForm'>
        <Card.Body>
          <Card.Title>Please Login</Card.Title>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => {
                this.setState({email: e.target.value})
              }}/>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => {
                this.setState({password: e.target.value})
              }}/>
            </Form.Group>
            <Form.Group controlId="adminCheckbox">
              <Form.Check type="checkbox" label="admin" value={admin} onChange={e => {
                this.setState({admin: e.target.value})
              }}/>
            </Form.Group>
            {error ? <Alert variant='danger'>{error}</Alert> : null}
            <Button variant="primary" type="submit" className={'loginButton'} onClick={e => {
              e.preventDefault()//No refresh, please.
              if(!email || !password){
                return this.setState({error: 'Email and password are required'})
              }
              axios.post('signin', {
                email: email,
                password: password,
                admin: admin
              }).then(res => {
                const {firstName, lastName, id, role} = res.data
                //res is stored in axios config if token is present
                this.setState({error: ''})
                setUserData({firstName: firstName, lastName: lastName, id: id, role: role, loggedIn: true})
                document.getElementById('storyCreateLink').click()
              }).catch(e => {
                this.setState({error: e.message})
              })
            }}>Log In</Button>
          </Form>
        </Card.Body>
      </Card>
    )
  }
}
