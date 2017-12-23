import React from 'react';
import Header from './Header';
import Footer from './Footer';


export default class Layout extends React.Component{
    render(){
        return(
            <div>
            <Header title="My React App" />
            {this.props.children}
            <Footer />
            </div>
        )

    }

}