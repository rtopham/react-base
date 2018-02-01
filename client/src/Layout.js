import React from 'react';
import Header from './Header';
import Footer from './Footer';


export default class Layout extends React.Component{
    render(){
        return(
            <div>
            <Header title="My React App" />
            <div className="container">
            <div className="row">
            {this.props.children}
            </div>
            </div>
            <Footer />
            </div>
        )

    }

}