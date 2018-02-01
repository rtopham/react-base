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
//                console.log(this.props.match);
                this.props.history.replace('/public')
            }
            else {
                try {
//                    console.log(this.props.match);
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
                    <AuthComponent user={this.state.user} {...this.props} />
                )
            }
            else {
                return null
            }
        }
        
            }

}