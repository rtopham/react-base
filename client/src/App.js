import React, { Component } from 'react';
import './App.css';
import {Route, Redirect, BrowserRouter as Router, Switch} from 'react-router-dom';

import Public from './Public.js';
import SignUpUser from './Signup.js';
import UserLogin from './Login.js';
import Coolstuff from './Coolstuff.js';
import UploadImage from './UploadImage.js';
import ShowImage from './ShowImage.js';
import Images from './Images.js';

const NoMatch = () => <p>Page Not Found</p>;

export default class App extends Component {

render(){

return(
<div className = "container-fluid appframe">
  
<Router>
  <Switch>
    <Redirect exact from="/" to="/public" />
    <Route exact path = '/public' component = {Public}/>
    <Route exact path = '/login' component ={UserLogin}/>
    <Route exact path = '/signup' component = {SignUpUser}/>
    <Route exact path = '/coolstuff' component ={Coolstuff}/>
    <Route exact path = '/upload' component ={UploadImage}/>
    <Route exact path = '/images' component ={Images}/>
    <Route path = '/images/:id' component = {ShowImage}/>
    
    <Route path="*" component={NoMatch} />
  </Switch>
</Router>
 
</div>
)
}
}

