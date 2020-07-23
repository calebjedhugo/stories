import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from './components/Login'
import StoryCreate from './components/StoryCreate'
import StoryList from './components/StoryList'
import Welcome from './components/Welcome'

import Storage from './storage.js';
const storage = new Storage()

axios.defaults.baseURL = function(){
  if(process.env.NODE_ENV === 'development'){
    return 'http://localhost:3000/api/v1/'
  } else {
    return '/api/v1/'
  }
}()

//Set up api calls. auth header will be set in "getUserData" below if none is stored.
axios.defaults.headers.common['Authorization'] = storage.userData ? storage.userData.token : undefined
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.response.use(undefined, e => { //Let the user know if the jwt is rejected and take them to the login screen.
  if(e.response.data === 'Login Required'){
    setTimeout(() => {
      let logout = document.getElementById('logout')
      if(logout){
        logout.click()
      } else { //interface is already set to go.
        storage.userData = ''; //clear out local storage
        axios.defaults.headers.common['Authorization'] = '';
      }
    }, 3000); //3s to be polite. Wrapped in the if just in case they already clicked it.
    e.response.data = 'Login Required'
  }
  return Promise.reject(e);
});

axios.interceptors.response.use((res) => {
  let {token} = res.data //Update the userData anytime the server sends a token.
  if(token){
    axios.defaults.headers.common['Authorization'] = token;
    storage.userData = res.data
  }
  return Promise.resolve(res)
})

class App extends Component {
  state = this.initState

  get initState(){
    return {
      loggedIn: Boolean(storage.userData),
      role: '',
      firstName: '',
      lastName: '',
      id: null
    }
  }

  componentDidMount(){
    const {loggedIn} = this.state
    if(loggedIn){
      this.setState(storage.userData)
    }
  }

  get main(){
    return (
      <Router>
        <div>
          <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Link to="/">Home</Link>
                <Link id={'storyCreateLink'} to="/storyCreate">Create Story</Link>
                <Link id={'storyListLink'} to="/storyList">See Stories</Link>
                <Link to="/" onClick={() => {
                  storage.userData = undefined
                  this.setState(this.initState)
                }}>Log Out</Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route path="/storyCreate">
              <StoryCreate />
            </Route>
            <Route path="/storyList">
              <StoryList />
            </Route>
            <Route path="/">
            <Welcome {...this.state}/>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }

  render() {
    const {loggedIn} = this.state
    return (
      <div className="App">
        {
          loggedIn ?
            this.main :
            <Login setUserData={userData => {
              this.setState({...userData})
            }}/>
        }
      </div>
    )
  }
}

export default App;
