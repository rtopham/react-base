import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './Layout.js';

class Public extends Component {

render(){

return(
<Layout> 

<div className="App">
  <div className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h2>Welcome To the Public Page</h2>
  </div>
  <p className="App-intro">
  </p>
</div>

</Layout>
)
}

}

export default Public;