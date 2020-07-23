import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Login from './components/Login'
import StoryCreate from './components/StoryCreate'

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
  state = {
    loggedIn: Boolean(storage.userData),
    role: '',
    firstName: '',
    lastName: '',
    id: null,
  }

  render() {
    const {loggedIn} = this.state
    return (
      <div className="App">
        {
          loggedIn ?
            <StoryCreate /> :
            <Login setUserData={userData => {
              this.setState({...userData})
            }}/>
        }
      </div>
    )
  }
}

export default App;
