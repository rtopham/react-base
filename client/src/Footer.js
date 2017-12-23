import React from 'react';
//import {Button, Glyphicon, Navbar, MenuItem, Nav, NavItem, NavDropdown} from 'react-bootstrap';
//import {LinkContainer} from 'react-router-bootstrap';

const Footer = (props)=>{

const currentYear = new Date().getFullYear();

    return(
      <div>
        <hr/>
        <h6 className="centerthis">Copyright &#9400; {currentYear} Singletrack Ventures, LLC</h6>
        <hr/>
        </div>
    )
    
    }

export default Footer;