import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {

    const Auth = new AuthService('http://localhost:3000');
       return class AuthWrapped extends Component {
        constructor(props) {
            super();
            this.state = {
                user: null
            }
        }        
        componentWillMount() {

            if (!Auth.loggedIn()) {
//                console.log(this.props.history);
                this.props.history.replace('/public')
            }
            else {
                try {
                    
                    const profile = Auth.getProfile()
                    this.setState({
                        user: profile
                    })
                }
                catch(err){
                    
                    Auth.logout()
                    this.props.history.replace('/login')
                }
            }
        }
        render() {
 
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            }
            else {
                return null
            }
        }
        
            }

}