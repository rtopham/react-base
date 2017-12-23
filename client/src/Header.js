import React from 'react';
import {Glyphicon, Navbar, MenuItem, Nav, NavItem, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {withRouter} from 'react-router-dom';
import AuthService from './AuthService';
const Auth = new AuthService('http://localhost:3000');

class Header extends React.Component {
  constructor(props) {
    super(props);

this.handleLogout = this.handleLogout.bind(this);
  }

handleLogout(){ 
    Auth.logout()
    this.props.history.replace('/login');
  }  
  
 render(){ 
    let settingsMenuItem;
    let loginNavItem;
    let signupNavItem;
    let loggedin=Auth.loggedIn();

    if(loggedin){
      loginNavItem = (<NavItem onClick={this.handleLogout}>Logout</NavItem>);
      signupNavItem = "";
      settingsMenuItem =(<NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal" />} noCaret>
                         <MenuItem onClick={this.handleLogout} >Settings</MenuItem>
                         </NavDropdown>
                         );
  
    }else{
      loginNavItem =(<LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>);
      signupNavItem = (<LinkContainer to="/signup"><NavItem>Signup</NavItem></LinkContainer>);
      settingsMenuItem="";
    }
    
    return(
    <div>
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>{this.props.title}</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="/features">
          <NavItem>Features</NavItem>
        </LinkContainer>
        <LinkContainer to="/TBD">
          <NavItem>TBD</NavItem>
        </LinkContainer>
        <LinkContainer to="/TBD2">
          <NavItem>TBD2</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
      {loginNavItem}    
      {signupNavItem}   
      {settingsMenuItem}
      </Nav>
    </Navbar>
  
    </div>
    );
  }

}

  export default withRouter(Header);