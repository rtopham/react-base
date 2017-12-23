import React, { Component } from 'react';
import logo from './logo.svg';
import withAuth from './withAuth';
import Layout from './Layout';

class Coolstuff extends Component {

render(){

return(
<Layout> 
<div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome {this.props.user.username}</h2>
        </div>
        <p className="App-intro">

        </p>
        </div>
</Layout>
)
}
}
export default withAuth(Coolstuff);