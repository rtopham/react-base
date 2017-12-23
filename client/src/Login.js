import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Layout from './Layout.js';
import AuthService from './AuthService';

export default class UserLogin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email:"",
            password: "",
            errorMessage:""
        };
        this.Auth = new AuthService();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){

        if(this.Auth.loggedIn())
        this.props.history.replace('/coolstuff');
    }

    validateForm(){
        return this.state.email.length > 0 && this.state.password.length >0;
    }

    handleChange = event =>{
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        this.Auth.login(this.state.email,this.state.password)
        .then(res =>{
//            console.log(res);
           if(res.err!=null) this.setState(prevState=>{
//               console.log('getting here bud')
//               console.log(res.err)
               return {
                   errorMessage: res.err
               }
               
           })
               
//           console.log(this.state) 
           if(res.success) this.props.history.replace('/coolstuff'); //if login successful, go to protected page, otherwise, stay on login page showing error.
        })
        .catch(err =>{
            console.log(err); //not sure this will ever get called.
            //alert(err); // this is what throws the alert.
        })

    }

    render(){
        
        return(
            <Layout>
            <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>
              <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
              >
                Login
              </Button>
              <p></p>
              <p className="centerthis error">{this.state.errorMessage}</p>
            </form>
          </div>
          </Layout>
        )
    }
}